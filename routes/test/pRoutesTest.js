const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const projectRoutes = require('../routes/projectRoutes');
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// Mock middleware and controllers
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../controllers/projectController', () => ({
  getAllProjects: jest.fn(),
  getProject: jest.fn(),
  createProject: jest.fn(),
  updateProject: jest.fn(),
  deleteProject: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/projects', projectRoutes);

describe('Project Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /projects', () => {
    it('should call the createProject controller', async () => {
      createProject.mockImplementation((req, res) => res.status(201).json({ message: 'Project created', project_id: 1 }));

      const res = await supertest(app)
        .post('/projects')
        .send({ name: 'New Project', description: 'Test description' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Project created', project_id: 1 });
      expect(authenticateToken).toHaveBeenCalled();
      expect(createProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle validation errors in createProject controller', async () => {
      createProject.mockImplementation((req, res) => res.status(400).json({ message: 'Validation error' }));

      const res = await supertest(app)
        .post('/projects')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Validation error' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(createProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('GET /projects', () => {
    it('should call the getAllProjects controller', async () => {
      getAllProjects.mockImplementation((req, res) => res.status(200).json([{ project_id: 1, name: 'Test Project' }]));

      const res = await supertest(app).get('/projects');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ project_id: 1, name: 'Test Project' }]);
      expect(authenticateToken).toHaveBeenCalled();
      expect(getAllProjects).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('GET /projects/:projectId', () => {
    it('should call the getProject controller', async () => {
      getProject.mockImplementation((req, res) => res.status(200).json({ project_id: 1, name: 'Test Project' }));

      const res = await supertest(app).get('/projects/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ project_id: 1, name: 'Test Project' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle not found errors in getProject controller', async () => {
      getProject.mockImplementation((req, res) => res.status(404).json({ message: 'Project not found' }));

      const res = await supertest(app).get('/projects/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Project not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('PUT /projects/:projectId', () => {
    it('should call the updateProject controller', async () => {
      updateProject.mockImplementation((req, res) => res.status(200).json({ message: 'Project updated' }));

      const res = await supertest(app)
        .put('/projects/1')
        .send({ name: 'Updated Project', description: 'Updated description' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Project updated' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(updateProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle validation errors in updateProject controller', async () => {
      updateProject.mockImplementation((req, res) => res.status(400).json({ message: 'Validation error' }));

      const res = await supertest(app)
        .put('/projects/1')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Validation error' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(updateProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('DELETE /projects/:projectId', () => {
    it('should call the deleteProject controller', async () => {
      deleteProject.mockImplementation((req, res) => res.status(200).json({ message: 'Project deleted' }));

      const res = await supertest(app).delete('/projects/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Project deleted' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle not found errors in deleteProject controller', async () => {
      deleteProject.mockImplementation((req, res) => res.status(404).json({ message: 'Project not found' }));

      const res = await supertest(app).delete('/projects/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Project not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteProject).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });
});
