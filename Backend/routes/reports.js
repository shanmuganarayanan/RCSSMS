const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/authentication');

router.get('/list', auth, async (req, res) => {
  try {
    const reports = await Report.find().populate('contactId', 'name phoneNumber');
    res.json(reports);
  } catch (err) {
    console.error('Error fetching all reports:', err.message);
    res.status(500).send('Server error');
  }
});


router.get('/:campaignId', auth, async (req, res) => {
  const { campaignId } = req.params;

  try {
    const reports = await Report.find({ campaignId }).populate('contactId', 'name phoneNumber');
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
