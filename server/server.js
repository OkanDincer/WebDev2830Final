const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budget');
const summaryRoutes = require('./routes/summary');
const userRoutes = require('./routes/users');

dotenv.config();

let dbConnected = false;
connectDB().then(() => {
  dbConnected = true;
}).catch(() => {
  dbConnected = false;
});

const app = express();

app.use(cors());
app.use(express.json());

if (dbConnected) {
  app.use('/transactions', transactionRoutes);
  app.use('/budget', budgetRoutes);
  app.use('/summary', summaryRoutes);
  app.use('/users', userRoutes);
}

app.get('/', (req, res) => {
  if (dbConnected) {
    res.json({ message: 'SmartlyBudget backend is running' });
  } else {
    res.json({ message: 'Backend running but DB not connected' });
  }
});

const PORT = process.env.PORT || 5000;

if (PORT === 5000) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} else {
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
}
