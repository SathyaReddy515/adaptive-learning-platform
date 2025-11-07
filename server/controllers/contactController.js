// --- In server/controllers/contactController.js ---

// @desc    Handle form submission from landing page
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { email, message } = req.body;

    // 🚀 In a real app, you would integrate a service like SendGrid, Nodemailer, or AWS SES here.
    // For this project, we will log the message to the server console.

    console.log(`\n📬 NEW CONTACT FORM SUBMISSION 📬`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------');

    res.status(200).json({ message: 'Thank you! Your message has been received.' });
  } catch (error) {
    console.error('Contact Form Error:', error);
    res.status(500).json({ message: 'Server failed to process your request.' });
  }
};