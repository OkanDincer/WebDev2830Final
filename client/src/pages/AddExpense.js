import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AddExpense({ userId }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //validtates input and sends to api
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      alert("Please fill amount and category");
      return;
    }

    try {
      const transaction = {
        userId,
        amount: parseFloat(formData.amount),
        type: 'expense',           
        category: formData.category,
        date: formData.date,
      };

      await api.createTransaction(transaction);
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (err) {
      console.error("Error adding expense:", err);
      alert("Failed to add transaction. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Add Expense</h3>
            </div>
            <div className="card-body">
              {success ? (
                <div className="alert alert-success text-center">
                  Transaction added successfully! Redirecting...
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount ($)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">Category</label>
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
                      <option value="Savings">Savings</option>           
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-danger">
                      Add Transaction
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;
