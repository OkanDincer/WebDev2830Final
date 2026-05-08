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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadDefaultUser = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const user = await api.getDefaultUser();
        if (user && user._id) {
          setUserId(user._id);
        } else {
          if (retryCount < 3) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              loadDefaultUser();
            }, 1000);
          } else {
            setHasError(true);
          }
        }
      } catch (err) {
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            loadDefaultUser();
          }, 1000);
        } else {
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!userId && !hasError) {
      loadDefaultUser();
    }
  }, [userId, hasError, retryCount]);

  const currentUserId = userId || 'default';

  return (
    <BrowserRouter>
      <NavBar />
      <div className="app-container">
        {isLoading && <div className="text-center">Loading...</div>}
        {hasError && <div className="text-center text-danger">Error loading app</div>}
        {!isLoading && !hasError && (
          <Routes>
            <Route path="/" element={<Dashboard userId={currentUserId} />} />
            <Route path="/add-income" element={<AddIncome userId={currentUserId} />} />
            <Route path="/add-expense" element={<AddExpense userId={currentUserId} />} />
            <Route path="/budget" element={<Budget userId={currentUserId} />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
