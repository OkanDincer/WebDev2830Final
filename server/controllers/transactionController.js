const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

const createTransaction = async (req, res) => {
  try {
    const { userId, amount, type, category, date } = req.body;
    const transaction = new Transaction({ userId, amount, type, category, date });
    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, date } = req.body;

    const updateData = {};
    if (amount != null) updateData.amount = amount;
    if (type) updateData.type = type;
    if (category) updateData.category = category;
    if (date) updateData.date = date;

    const updatedTransaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });
    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Error updating transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting transaction' });
  }
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

module.exports = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
