import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard({ userId }) {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [budgetView, setBudgetView] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();

  const loadData = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const [summaryData, transactionsData, budgetsData] = await Promise.all([
        api.getSummary(userId).catch(() => ({ totalIncome: 0, totalExpenses: 0, balance: 0 })),
        api.getTransactions(userId).catch(() => []),
        api.getBudgets(userId).catch(() => []),
      ]);

      setSummary(summaryData);
      setTransactions(transactionsData || []);
      setBudgets(budgetsData);

      const sorted = [...(transactionsData || [])].sort((a, b) => 
        sortOrder === 'desc' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
      );
      
      setFilteredTransactions(sorted);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && userId !== 'default') {
      loadData();
    }
  }, [userId, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.deleteTransaction(id);
      loadData();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);   
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPeriodStart = (view) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (view === 'daily') return today;
    if (view === 'weekly') {
      const firstDay = today.getDate() - today.getDay();
      return new Date(today.getFullYear(), today.getMonth(), firstDay);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const getSpentInPeriod = (budgetCategory, view) => {
    const periodStart = getPeriodStart(view);
    
    return transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        const txCategory = (t.category || '').toLowerCase().trim();
        const budgetCat = (budgetCategory || '').toLowerCase().trim();
        return txCategory === budgetCat || txCategory.includes(budgetCat) || budgetCat.includes(txCategory);
      })
      .filter(t => {
        const txDate = new Date(t.date);
        txDate.setDate(txDate.getDate() + 1);
        return txDate >= periodStart;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  };

  const getBudgetUsage = () => {
    return budgets.map(budget => {
      const spent = getSpentInPeriod(budget.category, budgetView);
      let allotted = budget.limit;

      if (budgetView === 'weekly') allotted = budget.limit / 4.345;
      if (budgetView === 'daily') allotted = budget.limit / 30.4375;

      const usagePercent = allotted > 0 ? Math.min((spent / allotted) * 100, 100) : 0;

      return { ...budget, spent, allotted, usagePercent };
    });
  };

  const budgetUsage = getBudgetUsage();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <div className="text-end">
          <small className="text-muted">Today:</small><br />
          <strong>{currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</strong>
        </div>
      </div>

      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Total Income</h5>
              <h3>${summary.totalIncome.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5>Total Expenses</h5>
              <h3>${summary.totalExpenses.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card text-white ${summary.balance >= 0 ? 'bg-info' : 'bg-warning'}`}>
            <div className="card-body">
              <h5>Balance</h5>
              <h3>${summary.balance.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Budget Overview — {budgetView.charAt(0).toUpperCase() + budgetView.slice(1)}</h5>
          <div className="btn-group">
            <button className={`btn btn-sm ${budgetView === 'monthly' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setBudgetView('monthly')}>Monthly</button>
            <button className={`btn btn-sm ${budgetView === 'weekly' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setBudgetView('weekly')}>Weekly</button>
            <button className={`btn btn-sm ${budgetView === 'daily' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setBudgetView('daily')}>Daily</button>
          </div>
        </div>
        <div className="card-body">
          {budgets.length === 0 ? (
            <p className="text-muted">No budgets set yet. Go to Budget page to create one.</p>
          ) : (
            <div className="row g-3">
              {budgetUsage.map((budget) => (
                <div className="col-md-6" key={budget._id}>
                  <div className="d-flex justify-content-between mb-1">
                    <strong>{budget.category}</strong>
                    <span>${budget.spent.toFixed(2)} / ${budget.allotted.toFixed(2)}</span>
                  </div>
                  <div className="progress" style={{ height: '25px' }}>
                    <div 
                      className={`progress-bar ${budget.usagePercent > 90 ? 'bg-danger' : budget.usagePercent > 70 ? 'bg-warning' : 'bg-success'}`}
                      style={{ width: `${budget.usagePercent}%` }}
                    >
                      {budget.usagePercent.toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      
      <div className="mb-3">
        <button className="btn btn-secondary me-2" onClick={toggleSort}>
          Sort by Date ({sortOrder === 'desc' ? 'Newest First' : 'Oldest First'})
        </button>
        <button className="btn btn-primary" onClick={loadData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Recent Transactions ({filteredTransactions.length})</h5>
        </div>
        <div className="card-body">
          {filteredTransactions.length === 0 ? (
            <p className="text-muted">No transactions yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>
                        <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.category}</td>
                      <td>${Number(transaction.amount).toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(transaction._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
