const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authentication');
const Group = require('../models/group');

router.post('/creategroup', auth, async (req, res) => {
  const { groupName, phoneNumbers } = req.body;

  try {
    if (!Array.isArray(phoneNumbers) || phoneNumbers.length === 0) {
      return res.status(400).json({ msg: 'Please provide at least one phone number' });
    }

    const contacts = await Promise.all(
      phoneNumbers.map(number => new Contact({ phoneNumber: number }).save())
    );

    const group = new Group({
      groupName,
      contacts: contacts.map(contact => contact._id),
    });

    await group.save();

    res.status(201).json(group);
  } catch (err) {
    console.error('Error creating group:', err.message);
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
