const express = require('express');
const router = express.Router();
const Credit = require('../models/Credit');
const auth = require('../middleware/authentication');

router.get('/', auth, async (req, res) => {
  try {
    const credits = await Credit.findOne({ userId: req.user.id });
    res.json(credits);
  } catch (err) {
    console.error('Error fetching credits:', err.message);
    res.status(500).send('Server error');
  }
});

router.post('/add', auth, async (req, res) => {
  const { amount } = req.body;

  try {
    let credits = await Credit.findOne({ userId: req.user.id });
    if (!credits) {
      credits = new Credit({
        userId: req.user.id,
        credits: amount,
      });
    } else {
      credits.credits += amount;
    }

    await credits.save();
    res.json(credits);
  } catch (err) {
    console.error('Error adding credits:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
