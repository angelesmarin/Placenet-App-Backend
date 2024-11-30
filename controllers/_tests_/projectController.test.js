const { Property, Project } = require('../models');
const projectController = require('../projectController');
const httpMocks = require('node-mocks-http');

jest.mock('../models', () => ({
  Property: {
    findOne: jest.fn(),
  },
  Project: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Project Controller', () => {
  describe('createProject', () => {
    it('should create a project if the property belongs to the user', async () => {
      const mockProperty = { property_id: 1, user_id: 1 };
      Property.findOne.mockResolvedValue(mockProperty);

      const mockProject = { project_id: 1, name: 'New Project' };
      Project.create.mockResolvedValue(mockProject);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        body: {
          property_id: 1,
          name: 'New Project',
          description: 'A test project',
          start_date: '2024-01-01',
        },
      });
      const res = httpMocks.createResponse();

      await projectController.createProject(req, res);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(mockProject);
      expect(Property.findOne).toHaveBeenCalledWith({ where: { property_id: 1, user_id: 1 } });
      expect(Project.create).toHaveBeenCalledWith({
        property_id: 1,
        user_id: 1,
        name: 'New Project',
        description: 'A test project',
        start_date: '2024-01-01',
      });
    });

    it('should return 403 if the property does not belong to the user', async () => {
      Property.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        body: {
          property_id: 2,
          name: 'Unauthorized Project',
          description: 'Test',
          start_date: '2024-01-01',
        },
      });
      const res = httpMocks.createResponse();

      await projectController.createProject(req, res);

      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'unauthorized to create project');
    });

    it('should handle errors when creating a project', async () => {
      Property.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        body: {
          property_id: 1,
          name: 'Error Project',
          description: 'Test',
          start_date: '2024-01-01',
        },
      });
      const res = httpMocks.createResponse();

      await projectController.createProject(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error making project');
    });
  });

  describe('getProject', () => {
    it('should return a project if it belongs to the user', async () => {
      const mockProject = { project_id: 1, name: 'Project A' };
      Project.findOne.mockResolvedValue(mockProject);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.getProject(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockProject);
      expect(Project.findOne).toHaveBeenCalledWith({
        where: { project_id: 1 },
        include: {
          model: Property,
          where: { user_id: 1 },
        },
      });
    });

    it('should return 404 if project is not found', async () => {
      Project.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.getProject(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Project not found or not authoritzed');
    });

    it('should handle errors when retrieving a project', async () => {
      Project.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.getProject(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error getting projects');
    });
  });

  describe('getAllProjects', () => {
    it('should return all projects belonging to the user', async () => {
      const mockProjects = [
        { project_id: 1, name: 'Project A' },
        { project_id: 2, name: 'Project B' },
      ];
      Project.findAll.mockResolvedValue(mockProjects);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        query: { property_id: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.getAllProjects(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockProjects);
      expect(Project.findAll).toHaveBeenCalledWith({
        include: {
          model: Property,
          where: { user_id: 1 },
          attributes: ['property_id', 'name'],
        },
        where: { property_id: 1 },
      });
    });

    it('should handle errors when retrieving all projects', async () => {
      Project.findAll.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        query: { property_id: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.getAllProjects(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error getting projects');
    });
  });

  describe('updateProject', () => {
    it('should update a project if it belongs to the user', async () => {
      const mockProject = {
        project_id: 1,
        name: 'Old Project',
        update: jest.fn().mockResolvedValue(),
      };
      Project.findOne.mockResolvedValue(mockProject);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
        body: { name: 'Updated Project', description: 'Updated Description' },
      });
      const res = httpMocks.createResponse();

      await projectController.updateProject(req, res);

      expect(res.statusCode).toBe(200);
      expect(mockProject.update).toHaveBeenCalledWith({
        property_id: undefined,
        name: 'Updated Project',
        description: 'Updated Description',
        start_date: undefined,
      });
    });

    it('should return 404 if project is not found', async () => {
      Project.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.updateProject(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Project not found or not authorized');
    });

    it('should handle errors when updating a project', async () => {
      Project.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.updateProject(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error updating project');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project if it belongs to the user', async () => {
      const mockProject = { project_id: 1, destroy: jest.fn().mockResolvedValue() };
      Project.findOne.mockResolvedValue(mockProject);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.deleteProject(req, res);

      expect(res.statusCode).toBe(200);
      expect(mockProject.destroy).toHaveBeenCalledTimes(1);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Project deleted successfully');
    });

    it('should return 404 if project is not found', async () => {
      Project.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.deleteProject(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Project not found or not authorized');
    });

    it('should handle errors when deleting a project', async () => {
      Project.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { projectId: 1 },
      });
      const res = httpMocks.createResponse();

      await projectController.deleteProject(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error deleting project');
    });
  });
});
