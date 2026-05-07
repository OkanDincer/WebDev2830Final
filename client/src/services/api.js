import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getDefaultUser = async () => {
  const response = await http.get('/users/default');
  return response.data;
};

const getTransactions = async (userId) => {
  const response = await http.get('/transactions', { params: { userId } });
  return response.data;
};

const createTransaction = async (transaction) => {
  const response = await http.post('/transactions', transaction);
  return response.data;
};

const updateTransaction = async (id, payload) => {
  const response = await http.put(`/transactions/${id}`, payload);
  return response.data;
};

const deleteTransaction = async (id) => {
  const response = await http.delete(`/transactions/${id}`);
  return response.data;
};

const updateBudget = async (budgetData) => {
  const response = await http.put('/budget', budgetData);
  return response.data;
};

const getSummary = async (userId) => {
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
