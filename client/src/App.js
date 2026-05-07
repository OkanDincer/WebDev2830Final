import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './services/api';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import Budget from './pages/Budget';

function App() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDefaultUser = async () => {
      try {
        setLoading(true);
        setError('');
        const user = await api.getDefaultUser();
        setUserId(user._id);
      } catch (err) {
        setError('Unable to connect to backend. Please start the server and try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDefaultUser();
  }, []);

  if (loading) {
    return (
      <div className="app-container text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Connecting to SmartlyBudget...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <NavBar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Dashboard userId={userId} />} />
          <Route path="/add-income" element={<AddIncome userId={userId} />} />
          <Route path="/add-expense" element={<AddExpense userId={userId} />} />
          <Route path="/budget" element={<Budget userId={userId} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
