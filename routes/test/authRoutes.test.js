const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const authRoute = require('../routes/authRoute');
const { register, login } = require('../controllers/authController');

jest.mock('../controllers/authController', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoute);

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should call the register controller', async () => {
      register.mockImplementation((req, res) => res.status(201).json({ message: 'User registered' }));

      const res = await supertest(app)
        .post('/auth/register')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'User registered' });
      expect(register).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle validation errors in the register controller', async () => {
      register.mockImplementation((req, res) => res.status(400).json({ message: 'Validation error' }));

      const res = await supertest(app)
        .post('/auth/register')
        .send({ username: '', password: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Validation error' });
    });
  });

  describe('POST /auth/login', () => {
    it('should call the login controller', async () => {
      login.mockImplementation((req, res) => res.status(200).json({ token: 'mocktoken', userId: 1 }));

      const res = await supertest(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ token: 'mocktoken', userId: 1 });
      expect(login).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle authentication errors in the login controller', async () => {
      login.mockImplementation((req, res) => res.status(401).json({ message: 'Invalid credentials' }));

      const res = await supertest(app)
        .post('/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid credentials' });
    });
  });
});
