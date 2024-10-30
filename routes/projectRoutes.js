const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.post('/', createProject);

router.get('/', getAllProjects);

router.get('/:projectId', getProjectById);

router.put('/:projectId', updateProject);

router.delete('/:projectId', deleteProject);

module.exports = router;
