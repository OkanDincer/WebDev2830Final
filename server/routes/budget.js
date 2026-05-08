const express = require('express');
const { upsertBudget, 
        getBudgets, 
        deleteBudget,
        deleteAllBudgets
} = require('../controllers/budgetController');

const router = express.Router();

router.get('/', getBudgets);
router.put('/', upsertBudget);
router.delete('/all', deleteAllBudgets); // must be BEFORE /:id
router.delete('/:id', deleteBudget);

module.exports = router;
