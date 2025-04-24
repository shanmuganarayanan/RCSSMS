const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'Account created successfully!', user: { name, email } });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Email does not exisit!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({ msg: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
