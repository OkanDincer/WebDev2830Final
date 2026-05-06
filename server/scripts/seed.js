const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Transaction.deleteMany({}),
      Budget.deleteMany({}),
    ]);

    const user = await User.create({
      username: 'smartuser',
      password: 'password123',
      dob: new Date('1990-01-01'),
    });

    const transactions = [
      { userId: user._id, amount: 1200, type: 'income', category: 'Salary', date: new Date() },
      { userId: user._id, amount: 80, type: 'expense', category: 'Groceries', date: new Date() },
      { userId: user._id, amount: 45, type: 'expense', category: 'Transport', date: new Date() },
      { userId: user._id, amount: 200, type: 'income', category: 'Freelance', date: new Date() },
    ];

    await Transaction.insertMany(transactions);

    await Budget.create({
      userId: user._id,
      category: 'Groceries',
      limit: 300,
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
