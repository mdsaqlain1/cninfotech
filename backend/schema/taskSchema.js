import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, // Foreign key
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
