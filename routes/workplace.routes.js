const router = require('express').Router();
const mongoose = require('mongoose');

const Workplace = require('../models/Workplace.model');


const { isAuthenticated } = require('../middleware/jwt.middleware');

//Create

router.post('/workplace', isAuthenticated, async (req, res, next) => {
  const {description, typeOfPlace, comment, rating } = req.body;

  try {
    const workplace = await Workplace.create({ description, typeOfPlace, comment, rating });

    res.json(workplace);
  } catch (error) {
    res.json(error);
  }
});

//Read (all)

router.get('/projects', async (req, res, next) => {
  try {
    const projects = await Project.find().populate('tasks');
    res.json(projects);
  } catch (error) {
    res.json(error);
  }
});

//Read (by id)

router.get('/projects/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id).populate('tasks');
    res.json(project);
  } catch (error) {
    res.json(error);
  }
});

//Update

router.put('/projects/:id', async (req, res, next) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json('The provided project id is not valid');
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.json(error);
  }
});

//Delete

router.delete('/projects/:id', async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.json('The provided project id is not valid');
  }

  try {
    //remove the tasks of the project
    const project = await Project.findById(id);
    await Task.deleteMany({ _id: project.tasks });

    //remove the project
    await Project.findByIdAndRemove(id);

    res.json({ message: `Project with the id ${id} deleted successfully` });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;