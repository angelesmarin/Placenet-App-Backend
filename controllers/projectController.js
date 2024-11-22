const Project = require('../models/Project');

//create
const createProject = async (req, res) => {
  try {
    const { property_id, name, description, start_date } = req.body;
    const user_id = req.user.userId;
    const property = await Property.findOne({
      where: { property_id, user_id },
    })
    if (!property) {
      return res.status(403).json({message: 'unauthorized to create project'});
    }
    //make new project 
    const newProject = await Project.create({ property_id, user_id, name, description, start_date });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error making project', error });
  }
 };

//get one
const getProject = async (req, res) => {
 try {
   const user_id = req.user.userId; //extract from jwt payload
   const project = await Project.findOne({
    where: { project_id: req.params.projectId },
    include: {
      model: Property,
      where: { user_id },
    },
   });
   if (!project) {
    return res.status(404).json({ message: 'Project not found or not authoritzed' });
   }
   res.status(200).json(project);
 } catch (error) {
   res.status(500).json({ message: 'Error getting projects', error });
 }
};

//get all
const getAllProjects = async (req, res) => {
  try {
      const user_id = req.user.userId; 
      const { property_id } = req.query; //property filter
      const queryOptions = {
          include: {
              model: Property,
              where: { user_id }, //property belongs to the logged-in user
              attributes: ['property_id', 'name'],
          },
          where: {},
      };
      if (property_id) {
          queryOptions.where.property_id = property_id;
      }
      //get all 
      const projects = await Project.findAll(queryOptions);
      res.status(200).json(projects);
  } catch (error) {
      res.status(500).json({ message: 'Error getting projects', error });
  }
};

// update project
const updateProject = async (req, res) => {
 try {
  const user_id = req.user.userId;
   const { property_id, name, description, start_date } = req.body;
   const project = await Project.findOne({
    where: { project_id: req.params.projectId },
    include: {
      model: Property,
      where: { user_id },
    },
  });
  if (!project) {
    return res.status(404).json({message: 'Project not found or not authorized'});
  }
   await project.update({ property_id, name, description, start_date });
   res.status(200).json(project);
 } catch (error) {
   res.status(500).json({ message: 'Error updating project', error });
 }
};


// delete project
const deleteProject = async (req, res) => {
 try {
  const user_id = req.user.userId;
  const project = await Project.findOne({
    where: { project_id: req.params.projectId },
    include: {
      model: Property,
      where: { user_id },
    },
  });
   if (!project) {
     return res.status(404).json({ message: 'Project not found or not authorized' });
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

