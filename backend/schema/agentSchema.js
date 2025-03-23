import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true },
  password: { type: String, required: true },
}, {
  timestamps: true, // optional, adds createdAt and updatedAt
});

const Agent = mongoose.model('Agent', agentSchema);

export { Agent };
