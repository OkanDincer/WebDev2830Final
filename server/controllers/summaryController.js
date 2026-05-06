const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const summary = await Transaction.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totals = summary.reduce(
      (acc, item) => {
        if (item._id === 'income') acc.income = item.total;
        if (item._id === 'expense') acc.expense = item.total;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    res.json({
      totalIncome: totals.income,
      totalExpenses: totals.expense,
      balance: totals.income - totals.expense,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching summary' });
  }
};

module.exports = {
  getSummary,
};
