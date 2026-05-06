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

  useEffect(() => {
    const loadDefaultUser = async () => {
      try {
        const user = await api.getDefaultUser();
        setUserId(user._id);
      } catch (err) {
        console.log('Error loading user');
      }
    };

    loadDefaultUser();
  }, []);

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
