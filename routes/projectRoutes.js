const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');//protect with jwt
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

router.use(authenticateToken);//protect route

router.post('/', createProject);
router.get('/', getAllProjects);
router.get('/:projectId', getProject);
router.put('/:projectId', updateProject);
router.delete('/:projectId', deleteProject);

module.exports = router;
