const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const campaignRoutes = require('./routes/campaigns');
const contactRoutes = require('./routes/contacts');
const reportRoutes = require('./routes/reports');
const creditRoutes = require('./routes/credits');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/credits', creditRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
