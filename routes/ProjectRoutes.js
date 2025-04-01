const express = require('express');
const Project = require('../models/Project');
const router = express.Router();
const cors=require('cors');
const app=express();



// @route   GET api/projects
// @desc    Get all projects
// @access  Public

app.use(cors());
 
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Add new project
// @access  Private (add authentication middleware in production)
router.post('/', async (req, res) => {
  const { title, description, technologies, githubLink, liveLink, image } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      image,
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;