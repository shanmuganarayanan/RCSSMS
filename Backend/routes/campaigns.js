const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const Contact = require('../models/Contact');
const Report = require('../models/Report');
const auth = require('../middleware/authentication');
const Group = require('../models/group')
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendTwilioMessage = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return { status: 'Delivered', sid: message.sid };
  } catch (error) {
    console.error(`Failed to send to ${to}:`, error.message);
    return { status: 'Failed', error: error.message };
  }
};

const mongoose = require('mongoose');

router.post('/createcampaign', auth, async (req, res) => {
  const { name, message, groupIds = [] } = req.body;

  try {
    if (!name || !message || !Array.isArray(groupIds) || groupIds.length === 0) {
      return res.status(400).json({ msg: 'name, message, and at least one groupId are required' });
    }
    const objectGroupIds = groupIds.map(id => new mongoose.Types.ObjectId(id));
    const groups = await Group.find({ _id: { $in: objectGroupIds } }).populate('contacts');

    if (!groups.length) {
      return res.status(404).json({ msg: 'No groups found for the provided groupIds' });
    }
    let contactIds = [];
    groups.forEach(group => {
      contactIds.push(...group.contacts.map(contact => contact._id.toString()));
    });

    contactIds = [...new Set(contactIds)];

    if (contactIds.length === 0) {
      return res.status(400).json({ msg: 'No contacts found in the selected groups' });
    }
    const newCampaign = new Campaign({
      name,
      message,
      recipients: contactIds,
      status: 'Pending',
      sendDate: new Date()
    });

    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (err) {
    console.error('Campaign creation error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.post('/send', auth, async (req, res) => {
  const { campaignId } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId).populate('recipients');

    if (!campaign) return res.status(404).json({ msg: 'Campaign not found' });

    campaign.status = 'Sent';
    await campaign.save();

    const reports = await Promise.all(campaign.recipients.map(async (contact) => {
      const result = await sendTwilioMessage(contact.phoneNumber, campaign.message);

      const report = new Report({
        campaignId,
        contactId: contact._id,
        phoneNumber: contact.phoneNumber,
        status: result.status,
        messageSid: result.sid || null,
        error: result.error || null,
      });

      return report.save();
    }));

    res.json({ msg: 'Messages sent via Twilio', campaign, reports });
  } catch (err) {
    console.error('Error sending messages:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
