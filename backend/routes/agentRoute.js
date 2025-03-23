import express from 'express';
import bcrypt from 'bcryptjs';
import {Agent} from '../schema/agentSchema.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Route to add/register an agent
router.post('/add', adminAuth, async (req, res) => {
  const { name, email, mobileNumber, password } = req.body;

  try {
    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new agent
    const newAgent = new Agent({
      name,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    // Save agent to database
    await newAgent.save();

    res.status(201).json({ message: 'Agent added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', adminAuth, async (req, res) => {
  try {
    const agents = await Agent.find({}, '-password'); // exclude passwords
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch agents', error: error.message });
  }
});


export default router;
