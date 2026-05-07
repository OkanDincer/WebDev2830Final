const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid userId' });
    }

    const summary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
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
    console.error('Error fetching summary:', error.message);
    res.status(500).json({ error: 'Unable to fetch summary' });
  }
};

module.exports = {
  getSummary,
};
