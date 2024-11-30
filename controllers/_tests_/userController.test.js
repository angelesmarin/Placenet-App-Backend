const { User } = require('../models');
const userController = require('../userController');
const httpMocks = require('node-mocks-http');

jest.mock('../models', () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
}));

describe('User Controller', () => {
  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, username: 'Alice' },
        { id: 2, username: 'Bob' },
      ];
      User.findAll.mockResolvedValue(mockUsers);

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await userController.getAllUsers(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockUsers);
      expect(User.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when retrieving all users', async () => {
      User.findAll.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      await userController.getAllUsers(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error getting users');
    });
  });

  describe('getUser', () => {
    it('should return a user when found', async () => {
      const mockUser = { id: 1, username: 'Alice' };
      User.findByPk.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.getUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith(1);
    });

    it('should return 404 if user is not found', async () => {
      User.findByPk.mockResolvedValue(null);

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.getUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'User not found');
    });

    it('should handle errors when retrieving a user', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.getUser(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error getting user');
    });
  });

  describe('updateUser', () => {
    it('should update a user and return the updated user', async () => {
      const mockUser = { id: 1, update: jest.fn().mockResolvedValue({ id: 1, username: 'UpdatedUser' }) };
      User.findByPk.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({
        params: { userId: 1 },
        body: { username: 'UpdatedUser', password_hash: 'newpasswordhash' },
      });
      const res = httpMocks.createResponse();

      await userController.updateUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ id: 1, username: 'UpdatedUser' });
      expect(mockUser.update).toHaveBeenCalledWith({ username: 'UpdatedUser', password_hash: 'newpasswordhash' });
    });

    it('should return 404 if user to update is not found', async () => {
      User.findByPk.mockResolvedValue(null);

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.updateUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'User not found');
    });

    it('should handle errors when updating a user', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.updateUser(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error updating user');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return a success message', async () => {
      const mockUser = { id: 1, destroy: jest.fn().mockResolvedValue() };
      User.findByPk.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.deleteUser(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'User deleted successfully');
      expect(mockUser.destroy).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if user to delete is not found', async () => {
      User.findByPk.mockResolvedValue(null);

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.deleteUser(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'User not found');
    });

    it('should handle errors when deleting a user', async () => {
      User.findByPk.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({ params: { userId: 1 } });
      const res = httpMocks.createResponse();

      await userController.deleteUser(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error deleting user');
    });
  });
});
