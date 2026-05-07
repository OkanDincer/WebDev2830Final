const mongoose = require('mongoose');
const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error.message);
    res.status(500).json({ error: 'Unable to fetch budgets' });
  }
};

const upsertBudget = async (req, res) => {
  try {
    const { userId, category, limit } = req.body;

    if (!userId || !category || limit == null) {
      return res.status(400).json({ error: 'userId, category, and limit are required' });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId, category },
      { userId, category, limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(budget);
  } catch (error) {
    console.error('Error upserting budget:', error.message);
    res.status(500).json({ error: 'Unable to save budget' });
  }
};

module.exports = {
  getBudgets,
  upsertBudget,
};
