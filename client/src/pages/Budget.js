import { useEffect, useState } from 'react';
import api from '../services/api';

function Budget({ userId }) {
  const [budgets, setBudgets] = useState([]);
  const [monthlySalary, setMonthlySalary] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    percentage: '',
    allocations: [
      { category: 'Needs', percent: 50 },
      { category: 'Wants', percent: 30 },
      { category: 'Savings', percent: 20 },
    ]
  });

  // Gets budgets for the user and updates state
  const loadBudgets = async () => {
    try {
      const data = await api.getBudgets(userId);
      setBudgets(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) loadBudgets();
  }, [userId]);

  const handleSalaryChange = (e) => setMonthlySalary(e.target.value);

  const handlePresetChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, percentage: value }));

    if (value === '50-30-20') {
      setFormData(prev => ({
        ...prev,
        name: '50/30/20 Plan',
        allocations: [
          { category: 'Needs', percent: 50 },
          { category: 'Wants', percent: 30 },
          { category: 'Savings', percent: 20 },
        ]
      }));
    } else if (value === '60-20-20') {
      setFormData(prev => ({
        ...prev,
        name: '60/20/20 Plan',
        allocations: [
          { category: 'Needs', percent: 60 },
          { category: 'Wants', percent: 20 },
          { category: 'Savings', percent: 20 },
        ]
      }));
    }
  };

  //validates input and sends to api
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monthlySalary) {
      alert("Please enter your estimated monthly salary");
      return;
    }

    try {
      const salary = parseFloat(monthlySalary);
      const totalPercent = formData.allocations.reduce((sum, item) => sum + item.percent, 0);

      if (totalPercent !== 100) {
        alert("Total percentage must equal 100%");
        return;
      }

      for (const alloc of formData.allocations) {
        const limit = (salary * alloc.percent) / 100;
        await api.updateBudget({
          userId,
          category: alloc.category,
          limit: limit,
        });
      }

      alert("Budget plan saved successfully!");
      loadBudgets();
      setMonthlySalary('');
    } catch (err) {
      console.error(err);
      alert("Failed to save budget");
    }
  };

  const handleDeleteAll = async () => {
    if (!budgets.length) return;
    if (!window.confirm(`Delete ALL ${budgets.length} budgets?`)) return;
    try {
      await api.deleteAllBudgets(userId);
      alert('All budgets deleted successfully');
      loadBudgets();
    } catch (err) {
      console.error(err);
      alert('Failed to delete budgets');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Budget Planner</h1>
        {budgets.length > 0 && (
          <button className="btn btn-danger" onClick={handleDeleteAll}>
            Delete All Budgets
          </button>
        )}
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Create Budget Plan</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Estimated Monthly Income</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    value={monthlySalary}
                    onChange={handleSalaryChange}
                    placeholder="5000"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Choose Budget Style</label>
                <select className="form-select" onChange={handlePresetChange} value={formData.percentage}>
                  <option value="">Custom</option>
                  <option value="50-30-20">50/30/20 (Classic)</option>
                  <option value="60-20-20">60/20/20 (Aggressive)</option>
                </select>
              </div>

              <h6 className="mt-4 fw-bold">Allocations</h6>
              <p className="text-muted small">Categories are fixed. Adjust the percentages below.</p>
              
              {formData.allocations.map((alloc, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control bg-light" 
                    value={alloc.category}
                    readOnly 
                    tabIndex="-1" 
                  />
                  <input
                    type="number"
                    className="form-control"
                    style={{ maxWidth: '120px' }}
                    value={alloc.percent}
                    onChange={(e) => {
                      const newAlloc = [...formData.allocations];
                      newAlloc[index].percent = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, allocations: newAlloc }));
                    }}
                  />
                  <span className="input-group-text">%</span>
                </div>
              ))}

              <div className="d-grid mt-4">
                <button onClick={handleSubmit} className="btn btn-primary btn-lg">
                  Save Budget Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h5 className="mb-0">Current Budgets</h5>
            </div>
            <div className="card-body">
              {budgets.length === 0 ? (
                <p className="text-muted text-center">No budgets set yet.</p>
              ) : (
                budgets.map(b => (
                  <div key={b._id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded shadow-sm">
                    <span className="fw-bold text-secondary">{b.category}</span>
                    <span className="badge bg-success fs-6">${b.limit.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;