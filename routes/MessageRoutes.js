const express = require('express');
const Message = require('../models/Message');
const router = express.Router();
const nodemailer = require('nodemailer');
const twilio = require('twilio');



// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Twilio SMS client setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// @route   POST api/messages
// @desc    Send a message and notify via email + SMS
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Save message to database
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // 2. Send email notification
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USERNAME}>`,
      to: process.env.EMAIL_USERNAME,
      subject: `New Message from ${name}`,
      text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <img src="https://cdn.pixabay.com/photo/2025/03/06/08/25/blueberries-9450130_1280.jpg"  />
        <p><em>Received at: ${new Date()}</em></p>
      `
    };
    await transporter.sendMail(mailOptions);

    // 3. Send SMS notification to your personal number
    await twilioClient.messages.create({
      body: `New message from ${name} (${email}): ${message.substring(0, 100)}...`,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio number
      to: process.env.MY_PERSONAL_NUMBER    // Your personal number with country code
    });

    res.json({ success: true, message: 'Message sent successfully' });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;