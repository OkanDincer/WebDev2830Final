const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budget');
const summaryRoutes = require('./routes/summary');
const userRoutes = require('./routes/users');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/transactions', transactionRoutes);
app.use('/budget', budgetRoutes);
app.use('/summary', summaryRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SmartlyBudget backend is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
