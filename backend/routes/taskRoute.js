import express from "express";
import multer from "multer";
import csvtojson from "csvtojson";
import fs from "fs";
import path from "path";

import {Agent} from "../schema/agentSchema.js";
import Task from "../schema/taskSchema.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Multer file filter for validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["text/csv", "application/vnd.ms-excel"]; // CSV MIME types only
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only CSV files are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

// Upload and distribute route
router.post('/upload',adminAuth, upload.single('file'), async (req, res) => {
    try {
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const ext = path.extname(file.originalname).toLowerCase();
  
      if (ext !== '.csv') {
        return res.status(400).json({ message: 'Only CSV files are allowed' });
      }
  
      // Parse CSV file
      const items = await csvtojson().fromFile(file.path);
  
      // Validate item fields
      const validItems = items.filter(item =>
        item.FirstName && item.Phone && item.Notes !== undefined
      );
  
      if (validItems.length === 0) {
        return res.status(400).json({ message: 'No valid records found in the CSV file' });
      }
  
      // Fetch agents
      const agents = await Agent.find();
      if (agents.length === 0) {
        return res.status(400).json({ message: 'No agents found in the system' });
      }
  
      // Distribute tasks among agents
      const distributedTasks = [];
  
      validItems.forEach((item, index) => {
        const assignedAgent = agents[index % agents.length]; // Sequential distribution
  
        const newTask = new Task({
          firstName: item.FirstName,
          phone: item.Phone,
          notes: item.Notes,
          assignedTo: assignedAgent._id
        });
  
        distributedTasks.push(newTask);
      });
  
      // Save tasks in DB
      await Task.insertMany(distributedTasks);
  
      // Delete file after processing
      fs.unlinkSync(file.path);
  
      res.status(200).json({ message: 'CSV uploaded and tasks distributed successfully' });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });


  router.get('/all', async (req, res) => {
    try {
      // Fetch all agents
      const agents = await Agent.find();
  
      if (!agents.length) {
        return res.status(404).json({ message: 'No agents found' });
      }
  
      // Fetch tasks grouped by each agent
      const agentLists = await Promise.all(
        agents.map(async (agent) => {
          // Find tasks assigned to this agent
          const tasks = await Task.find({ assignedTo: agent._id }).select('firstName phone notes -_id');
  
          return {
            agent: {
              name: agent.name,
              email: agent.email,
            },
            items: tasks.map(task => ({
              firstName: task.firstName,
              phone: task.phone,
              notes: task.notes
            }))
          };
        })
      );
  
      res.status(200).json(agentLists);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  

export default router;
