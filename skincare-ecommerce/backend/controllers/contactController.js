/**
 * Contact Controller
 * Handles contact form submissions
 */

const Message = require('../models/Message');

/**
 * POST /api/contact
 * Submit a contact message
 */
const submitMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const newMessage = await Message.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you within 24-48 hours.',
      data: newMessage
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to send message.' });
  }
};

/**
 * GET /api/contact
 * Get all messages (admin only)
 */
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};

module.exports = { submitMessage, getAllMessages };
