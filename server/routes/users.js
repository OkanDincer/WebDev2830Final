const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/default', async (req, res) => {
  try {
    let user = await User.findOne({ username: 'smartuser' });
    if (!user) {
      user = await User.create({
        username: 'smartuser',
        password: 'password123',
        dob: new Date('1990-01-01'),
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error getting user' });
  }
});

module.exports = router;