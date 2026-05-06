import { useEffect, useState } from 'react';
import api from '../services/api';

function Budget({ userId }) {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    limit: '',
  });

  const loadBudgets = async () => {
    try {
      const budgetsData = await api.getBudgets(userId);
      setBudgets(budgetsData);
    } catch (err) {
      console.log('Error loading budgets');
    }
  };

  useEffect(() => {
    if (userId) {
      loadBudgets();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        userId,
        category: formData.category,
        limit: parseFloat(formData.limit),
      };

      await api.updateBudget(budgetData);
      setFormData({ category: '', limit: '' });
      loadBudgets();
    } catch (err) {
      console.log('Error saving budget');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Budget Settings</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Set Budget Limit</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Transport">Transport</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="limit" className="form-label">
                    Monthly Limit ($)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="limit"
                    name="limit"
                    value={formData.limit}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Save Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5>Current Budgets</h5>
            </div>
            <div className="card-body">
              {budgets.length === 0 ? (
                <p className="text-muted">No budgets set yet.</p>
              ) : (
                <div className="list-group">
                  {budgets.map((budget) => (
                    <div key={budget._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">{budget.category}</span>
                        <span className="badge bg-primary">${budget.limit.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;