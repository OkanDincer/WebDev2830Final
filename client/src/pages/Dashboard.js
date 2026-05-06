import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard({ userId }) {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    try {
      const [summaryData, transactionsData] = await Promise.all([
        api.getSummary(userId),
        api.getTransactions(userId),
      ]);
      setSummary(summaryData);
      setTransactions(transactionsData);
    } catch (err) {
      console.log('Error loading data');
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  const handleDelete = async (id) => {
    try {
      await api.deleteTransaction(id);
      loadData();
    } catch (err) {
      console.log('Error deleting');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Dashboard</h1>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Total Income</h5>
              <h3>${summary.totalIncome.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Total Expenses</h5>
              <h3>${summary.totalExpenses.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card text-white ${summary.balance >= 0 ? 'bg-info' : 'bg-warning'}`}>
            <div className="card-body">
              <h5 className="card-title">Balance</h5>
              <h3>${summary.balance.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Recent Transactions</h5>
        </div>
        <div className="card-body">
          {transactions.length === 0 ? (
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
                  {transactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td>{transaction.category}</td>
                      <td>${transaction.amount.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(transaction._id)}
                        >
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