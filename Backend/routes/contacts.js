const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authentication');

router.post('/creategroup', auth, async (req, res) => {
  const { groupName, phoneNumbers} = req.body;  

  try {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return res.status(400).json({ msg: 'Please provide at least one phone number' });
    }

    const newContact = new Contact({
      groupName,
      phoneNumbers
    });

    await newContact.save();
    res.status(201).json(newContact);  
  } catch (err) {
    console.error('Error creating contact:', err.message);
    res.status(500).send('Server error');
  }
});

router.get('/group/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const contacts = await Contact.find({ _id: id });
    res.json(contacts);  
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
