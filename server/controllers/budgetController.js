const mongoose = require('mongoose');
const Budget = require('../models/Budget');

//gets budgets for user
const getBudgets = async (req, res) => {
  try {
    const { userId } = req.query;
    const budgets = await Budget.find({ userId });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching budgets' });
  }
};

//create or update budget
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

// Delete single budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; 

    const budget = await Budget.findOneAndDelete({ _id: id, userId });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting budget' });
  }
};

// Delete ALL budgets for a user
const deleteAllBudgets = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    await Budget.deleteMany({ userId });

    res.json({ message: 'All budgets deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting all budgets' });
  }
};

module.exports = {
  getBudgets,
  upsertBudget,
  deleteBudget,
  deleteAllBudgets
};
