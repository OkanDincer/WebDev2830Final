import { useEffect, useState } from 'react';
import api from '../services/api';

function Budget({ userId }) {
  const [budgets, setBudgets] = useState([]);
  const [monthlySalary, setMonthlySalary] = useState('');
  const [budgetMode, setBudgetMode] = useState('fixed');

  const [formData, setFormData] = useState({
    name: '',
    percentage: '',
    allocations: [
      { category: 'Needs (Rent, Utilities, etc.)', percent: 50 },
      { category: 'Wants (Entertainment, Dining)', percent: 30 },
      { category: 'Savings & Debt', percent: 20 },
    ]
  });

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
    } catch (err) {
      console.error(err);
      alert("Failed to save budget");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Budget Planner</h1>

      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">
              <h5>Create Budget Plan</h5>
            </div>
            <div className="card-body">

              <div className="mb-3">
                <label className="form-label">Estimated Monthly Income</label>
                <input
                  type="number"
                  className="form-control"
                  value={monthlySalary}
                  onChange={handleSalaryChange}
                  placeholder="5000"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Choose Budget Style</label>
                <select className="form-select" onChange={handlePresetChange}>
                  <option value="">Custom</option>
                  <option value="50-30-20">50/30/20 (Classic)</option>
                  <option value="60-20-20">60/20/20 (Aggressive Savings)</option>
                </select>
              </div>

              <h6 className="mt-4">Allocations</h6>
              {formData.allocations.map((alloc, index) => (
                <div key={index} className="input-group mb-2">
                  <input
                    type="text"
                    className="form-control"
                    value={alloc.category}
                    onChange={(e) => {
                      const newAlloc = [...formData.allocations];
                      newAlloc[index].category = e.target.value;
                      setFormData(prev => ({ ...prev, allocations: newAlloc }));
                    }}
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
          <div className="card">
            <div className="card-header">
              <h5>Current Budgets</h5>
            </div>
            <div className="card-body">
              {budgets.length === 0 ? (
                <p>No budgets set yet.</p>
              ) : (
                budgets.map(b => (
                  <div key={b._id} className="d-flex justify-content-between mb-2">
                    <span>{b.category}</span>
                    <strong>${b.limit.toFixed(2)}</strong>
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
