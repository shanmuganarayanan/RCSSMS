const express = require('express');
const router = express.Router();
const Campaign = require('../models/campaign');
const Contact = require('../models/Contact');
const Report = require('../models/Report');
const auth = require('../middleware/authentication');
const Group = require('../models/group')

router.post('/createcampaign', auth, async (req, res) => {
  const { name, message, recipients, groupIds = [] } = req.body;

  try {
    let allRecipients = [...recipients];

    if (groupIds.length) {
      const groups = await Group.find({ _id: { $in: groupIds } }).populate('contacts');
      groups.forEach(group => {
        allRecipients.push(...group.contacts.map(c => c._id.toString()));
      });
    }

    allRecipients = [...new Set(allRecipients)];

    const newCampaign = new Campaign({
      name,
      message,
      recipients: allRecipients,
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    console.error('Campaign creation error:', err.message);
    res.status(500).send('Server error');
  }
});


router.post('/send', auth, async (req, res) => {
  const { campaignId } = req.body;

  try {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ msg: 'Campaign not found' });
    }

    campaign.status = 'Sent';
    await campaign.save();

    const reports = await Promise.all(campaign.recipients.map(async (recipientId) => {
      const contact = await Contact.findById(recipientId);
      if (!contact) return null;

      const report = new Report({
        campaignId,
        contactId: contact._id,
        status: 'Delivered',
      });
      return report.save();
    }));

    res.json({ msg: 'RCS Sent', campaign, reports });
  } catch (err) {
    console.error('Error sending RCS:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
