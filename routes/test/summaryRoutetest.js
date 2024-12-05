const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const summaryRoutes = require('../routes/summaryRoutes');
const authenticateToken = require('../middleware/authMiddleware');
const { getPropertySummary } = require('../controllers/summaryController');

// Mock middleware and controller
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../controllers/summaryController', () => ({
  getPropertySummary: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/summary', summaryRoutes);

describe('Summary Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /summary', () => {
    it('should call the getPropertySummary controller', async () => {
      getPropertySummary.mockImplementation((req, res) => 
        res.status(200).json({ user: { user_id: 1, username: 'testuser' }, properties: [] })
      );

      const res = await supertest(app).get('/summary');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ user: { user_id: 1, username: 'testuser' }, properties: [] });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getPropertySummary).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle errors in the getPropertySummary controller', async () => {
      getPropertySummary.mockImplementation((req, res) => 
        res.status(500).json({ message: 'Error fetching summary' })
      );

      const res = await supertest(app).get('/summary');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ message: 'Error fetching summary' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getPropertySummary).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });
});
