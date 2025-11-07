const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to create a token
const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // 'role' is intentionally ignored

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user (FORCED AS STUDENT)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'student', // 👈 Hardcoded for security
    });

    // 4. If user created, create token and send back
    if (user) {
      const token = createToken(user._id);
      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    // 1. Get only email and password
    const { email, password } = req.body; 

    // 2. Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      // 3. User not found. Send a generic, secure error.
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4. Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 5. Password doesn't match. Send the same generic error.
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // 6. SUCCESS!
    // The user is valid. The backend is the source of truth for the role.
    const token = createToken(user._id);
    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 We return the TRUE role from the database
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};