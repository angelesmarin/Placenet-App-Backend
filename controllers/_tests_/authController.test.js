const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const authController = require('../authController');
const httpMocks = require('node-mocks-http');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
}));

describe('Auth Controller', () => {
  describe('register', () => {
    it('should create a new user and return a success message', async () => {
      const mockUser = { user_id: 1, username: 'testuser' };
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({
        body: { username: 'testuser', password: 'plaintextpassword' },
      });
      const res = httpMocks.createResponse();

      await authController.register(req, res);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: 'User created successfully',
        user: { user_id: 1, username: 'testuser' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('plaintextpassword', 10);
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        password_hash: 'hashedpassword',
      });
    });

    it('should handle errors during user creation', async () => {
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.create.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        body: { username: 'testuser', password: 'plaintextpassword' },
      });
      const res = httpMocks.createResponse();

      await authController.register(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error making user');
    });
  });

  describe('login', () => {
    it('should authenticate a user and return a JWT token', async () => {
      const mockUser = { user_id: 1, username: 'testuser', password_hash: 'hashedpassword' };
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockedtoken');
      User.findOne.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({
        body: { username: 'testuser', password: 'plaintextpassword' },
      });
      const res = httpMocks.createResponse();

      await authController.login(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        token: 'mockedtoken',
        userId: 1,
        message: 'Login successful',
      });
      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('plaintextpassword', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 1 },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    });

    it('should return 401 if the user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        body: { username: 'testuser', password: 'plaintextpassword' },
      });
      const res = httpMocks.createResponse();

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 if the password is incorrect', async () => {
      const mockUser = { user_id: 1, username: 'testuser', password_hash: 'hashedpassword' };
      bcrypt.compare.mockResolvedValue(false);
      User.findOne.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({
        body: { username: 'testuser', password: 'wrongpassword' },
      });
      const res = httpMocks.createResponse();

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Invalid credentials');
    });

    it('should handle errors during login', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        body: { username: 'testuser', password: 'plaintextpassword' },
      });
      const res = httpMocks.createResponse();

      await authController.login(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Login failed');
    });
  });
});
