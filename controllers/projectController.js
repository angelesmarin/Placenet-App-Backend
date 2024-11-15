const { Property, Project } = require('../models');



//get projects
const getAllProjects = async (req, res) => {
  try {
    const { user_id, property_id } = req.query;
    const queryOptions = {};
    if (user_id) {
      queryOptions.where = { ...queryOptions.where, user_id }; 
    }
    if (property_id) {
      queryOptions.where = { ...queryOptions.where, property_id };
    }
    const projects = await Project.findAll(queryOptions);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error getting projects', error });
  }
};


// get a project
const getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error getting project', error });
  }
};

// new project
const createProject = async (req, res) => {
  try {
    const { property_id, user_id, name, description, start_date } = req.body;
    const newProject = await Project.create({ property_id, user_id, name, description, start_date });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error making project', error });
  }
};

// update project
const updateProject = async (req, res) => {
  try {
    const { property_id, user_id, name, description, start_date } = req.body;
    const project = await Project.findByPk(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.update({ property_id, user_id, name, description, start_date });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
};

// delete project 
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.destroy();
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
