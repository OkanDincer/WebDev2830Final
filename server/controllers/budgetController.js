const mongoose = require('mongoose');
const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
};

const upsertBudget = async (req, res) => {
  try {
    const { userId, category, limit } = req.body;
    const budget = await Budget.findOneAndUpdate(
      { userId, category },
      { userId, category, limit },
      { new: true, upsert: true }
    );
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Error saving budget' });
  }
};

module.exports = {
  getBudgets,
  upsertBudget,
};
