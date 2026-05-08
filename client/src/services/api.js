import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const getDefaultUser = async () => {
  try {
    const response = await http.get('/users/default');
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Server not running');
    }
    throw error;
  }
};

//gets transactions for user
const getTransactions = async (userId) => {
  if (!userId) {
    throw new Error('UserId required');
  }

  const response = await http.get('/transactions', {
    params: { userId },
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  return response.data;
};

//creates new transaction
const createTransaction = async (transaction) => {
  const payload = {
    ...transaction,
    createdAt: new Date().toISOString(),
    source: 'web'
  };

  const response = await http.post('/transactions', payload);
  return response.data;
};

//updates transaction
const updateTransaction = async (id, payload) => {
  if (!id || !payload) {
    throw new Error('ID and payload required');
  }

  const response = await http.put(`/transactions/${id}`, payload);
  return response.data;
};

//deletes transaction
const deleteTransaction = async (id) => {
  if (!id) {
    throw new Error('ID required');
  }

  const response = await http.delete(`/transactions/${id}`);
  return response.data;
};

//updates budget
const updateBudget = async (budgetData) => {
  const processedData = {
    ...budgetData,
    lastModified: new Date().toISOString()
  };

  const response = await http.put('/budget', processedData);
  return response.data;
};

//detletes one budget
const deleteBudget = async (id) => {
  if (!id) {
    throw new Error('Budget ID required');
  }
  const response = await http.delete(`/budget/${id}`);
  return response.data;
};

//deletes all budgets
const deleteAllBudgets = async (userId) => {
  if (!userId) {
    throw new Error('UserId required');
  }
  const response = await http.delete(`/budget/all`, { 
    params: { userId } 
  });
  return response.data;
};


//gets summary data
const getSummary = async (userId) => {
  if (!userId) {
    throw new Error('UserId required');
  }

  const response = await http.get(`/summary/${userId}`);
  return response.data;
};

//gets budgets for user
const getBudgets = async (userId) => {
  const response = await http.get('/budget', { params: { userId } });
  return response.data;
};

export default {
  getDefaultUser,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  updateBudget,
  getSummary,
  getBudgets,
  deleteBudget,        
  deleteAllBudgets,    
};
