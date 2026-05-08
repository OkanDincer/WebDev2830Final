const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  try {
    let transactions = await Transaction.find({ userId });

    transactions = transactions.sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

const createTransaction = async (req, res) => {
  const { userId, amount, type, category, date } = req.body;

  try {
    if (!userId || !amount || !type || !category) {
      return res.status(400).json({ error: 'All fields required' });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const transaction = new Transaction({
      userId,
      amount: Number(amount),
      type,
      category,
      date: date ? new Date(date) : new Date()
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating transaction' });
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (updates.amount !== undefined) transaction.amount = updates.amount;
    if (updates.type !== undefined) transaction.type = updates.type;
    if (updates.category !== undefined) transaction.category = updates.category;
    if (updates.date !== undefined) transaction.date = updates.date;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Error updating transaction' });
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Transaction.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
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
