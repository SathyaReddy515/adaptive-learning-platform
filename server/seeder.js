const mongoose = require('mongoose');
require('dotenv').config(); // Load .env variables
const users = require('./data/users');
const questions = require('./data/questions');

// Import all models
const User = require('./models/User');
const Question = require('./models/Question');
const LearnerModel = require('./models/LearnerModel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // 👈 This is the original
    console.log('✅ MongoDB connected for seeder...');
  } catch (err) {
    console.error(`❌ Seeder connection error: ${err.message}`);
    process.exit(1);
  }
};

// Function to import all data
const importData = async () => {
  try {
    // 1. Clear all existing data
    await User.deleteMany();
    await Question.deleteMany();
    await LearnerModel.deleteMany();

    // 2. Insert new users
    await User.insertMany(users);
    
    // 3. Insert new questions
    await Question.insertMany(questions);

    console.log('🌱 Data Imported Successfully!');
    process.exit(); // Exit with success
  } catch (error) {
    console.error(`❌ Error importing data: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Function to destroy all data
const destroyData = async () => {
  try {
    // 1. Clear all existing data
    await User.deleteMany();
    await Question.deleteMany();
    await LearnerModel.deleteMany();

    console.log('🔥 Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// --- Script Execution Logic ---
// This connects to the DB first, then runs the correct function
const run = async () => {
  await connectDB();

  // Check for the '-d' flag (e.g., node seeder.js -d)
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

run();