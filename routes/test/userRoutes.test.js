const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const userRoutes = require('../routes/userRoutes');
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

// Mock middleware and controllers
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../controllers/userController', () => ({
  getAllUsers: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/users', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should call the getAllUsers controller', async () => {
      getAllUsers.mockImplementation((req, res) => 
        res.status(200).json([{ user_id: 1, username: 'user1' }])
      );

      const res = await supertest(app).get('/users');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ user_id: 1, username: 'user1' }]);
      expect(authenticateToken).toHaveBeenCalled();
      expect(getAllUsers).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('GET /users/:userId', () => {
    it('should call the getUser controller', async () => {
      getUser.mockImplementation((req, res) => 
        res.status(200).json({ user_id: 1, username: 'user1' })
      );

      const res = await supertest(app).get('/users/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ user_id: 1, username: 'user1' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle not found errors in getUser controller', async () => {
      getUser.mockImplementation((req, res) => 
        res.status(404).json({ message: 'User not found' })
      );

      const res = await supertest(app).get('/users/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('PUT /users/:userId', () => {
    it('should call the updateUser controller', async () => {
      updateUser.mockImplementation((req, res) => 
        res.status(200).json({ message: 'User updated' })
      );

      const res = await supertest(app)
        .put('/users/1')
        .send({ username: 'updateduser', password_hash: 'updatedhash' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'User updated' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(updateUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle validation errors in updateUser controller', async () => {
      updateUser.mockImplementation((req, res) => 
        res.status(400).json({ message: 'Validation error' })
      );

      const res = await supertest(app).put('/users/1').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Validation error' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(updateUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should call the deleteUser controller', async () => {
      deleteUser.mockImplementation((req, res) => 
        res.status(200).json({ message: 'User deleted' })
      );

      const res = await supertest(app).delete('/users/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'User deleted' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle not found errors in deleteUser controller', async () => {
      deleteUser.mockImplementation((req, res) => 
        res.status(404).json({ message: 'User not found' })
      );

      const res = await supertest(app).delete('/users/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'User not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });
});
