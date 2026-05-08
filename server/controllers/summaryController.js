const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

//gets summary for user
const getSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'default') {
      return res.json({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid userId format' });
    }

    const summary = await Transaction.aggregate([
      { 
        $match: { userId: new mongoose.Types.ObjectId(userId) } 
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totals = summary.reduce(
      (acc, item) => {
        if (item._id === 'income') acc.income = item.total || 0;
        if (item._id === 'expense') acc.expense = item.total || 0;
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
    console.error('Summary Error:', error);
    res.status(500).json({ 
      error: 'Error fetching summary',
      message: error.message 
    });
  }
};

module.exports = {
  getSummary,
};
