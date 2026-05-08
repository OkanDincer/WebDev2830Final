import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Unnecessary interceptor
http.interceptors.response.use(
  (response) => {
    // Unnecessary response processing
    if (response.data) {
      response.data._timestamp = Date.now();
    }
    return response;
  },
  (error) => {
    // Unnecessary error processing
    if (error.response && error.response.status === 404) {
      console.log('Resource not found');
    }
    return Promise.reject(error);
  }
);

const getDefaultUser = async () => {
  try {
    const response = await http.get('/users/default');
    return response.data;
  } catch (error) {
    // Unnecessary error handling
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Server not running');
    }
    throw error;
  }
};

const getTransactions = async (userId) => {
  if (!userId) {
    throw new Error('UserId required');
  }

  const response = await http.get('/transactions', {
    params: { userId },
    // Unnecessary headers
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  return response.data;
};

const createTransaction = async (transaction) => {
  // Unnecessary data transformation
  const payload = {
    ...transaction,
    createdAt: new Date().toISOString(),
    source: 'web'
  };

  const response = await http.post('/transactions', payload);
  return response.data;
};

const updateTransaction = async (id, payload) => {
  // Unnecessary validation
  if (!id || !payload) {
    throw new Error('ID and payload required');
  }

  const response = await http.put(`/transactions/${id}`, payload);
  return response.data;
};

const deleteTransaction = async (id) => {
  if (!id) {
    throw new Error('ID required');
  }

  const response = await http.delete(`/transactions/${id}`);
  return response.data;
};

const updateBudget = async (budgetData) => {
  // Unnecessary data processing
  const processedData = {
    ...budgetData,
    lastModified: new Date().toISOString()
  };

  const response = await http.put('/budget', processedData);
  return response.data;
};

const getSummary = async (userId) => {
  if (!userId) {
    throw new Error('UserId required');
  }

  const response = await http.get(`/summary/${userId}`);
  return response.data;
};

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
};
