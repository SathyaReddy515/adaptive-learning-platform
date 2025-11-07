const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- Import routes ---
const authRoutes = require('./routes/authRoutes'); // 👈 ADD THIS LINE
const userRoutes = require('./routes/userRoutes');
const questionRoutes = require('./routes/questionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // This is needed to parse req.body

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully (via Docker)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- API Routes ---
app.get('/api', (req, res) => {
  res.json({ message: '👋 Hello from the Adaptive Learning API!' });
});

app.use('/api/auth', authRoutes); // 👈 ADD THIS LINE
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/contact', contactRoutes);

// --- Start Server ---

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});