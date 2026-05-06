const express = require('express');
const { upsertBudget, getBudgets } = require('../controllers/budgetController');

const router = express.Router();

router.get('/', getBudgets);
router.put('/', upsertBudget);

module.exports = router;
