const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const propertyRoutes = require('../routes/propertyRoutes');
const authenticateToken = require('../middleware/authMiddleware');
const {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

// Mock middleware and controllers
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../controllers/propertyController', () => ({
  getAllProperties: jest.fn(),
  getProperty: jest.fn(),
  createProperty: jest.fn(),
  updateProperty: jest.fn(),
  deleteProperty: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/properties', propertyRoutes);

describe('Property Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /properties', () => {
    it('should call the createProperty controller', async () => {
      createProperty.mockImplementation((req, res) => res.status(201).json({ message: 'Property created', property_id: 1 }));

      const res = await supertest(app)
        .post('/properties')
        .send({ name: 'New Property' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Property created', property_id: 1 });
      expect(authenticateToken).toHaveBeenCalled();
      expect(createProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle validation errors in createProperty controller', async () => {
      createProperty.mockImplementation((req, res) => res.status(400).json({ message: 'Validation error' }));

      const res = await supertest(app).post('/properties').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Validation error' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(createProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('GET /properties', () => {
    it('should call the getAllProperties controller', async () => {
      getAllProperties.mockImplementation((req, res) => res.status(200).json([{ property_id: 1, name: 'Property A' }]));

      const res = await supertest(app).get('/properties');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ property_id: 1, name: 'Property A' }]);
      expect(authenticateToken).toHaveBeenCalled();
      expect(getAllProperties).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('GET /properties/:propertyId', () => {
    it('should call the getProperty controller', async () => {
      getProperty.mockImplementation((req, res) => res.status(200).json({ property_id: 1, name: 'Property A' }));

      const res = await supertest(app).get('/properties/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ property_id: 1, name: 'Property A' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle not found errors in getProperty controller', async () => {
      getProperty.mockImplementation((req, res) => res.status(404).json({ message: 'Property not found' }));

      const res = await supertest(app).get('/properties/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Property not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(getProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('PUT /properties/:propertyId', () => {
    it('should call the updateProperty controller', async () => {
      updateProperty.mockImplementation((req, res) => res.status(200).json({ message: 'Property updated' }));

      const res = await supertest(app)
        .put('/properties/1')
        .send({ name: 'Updated Property' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Property updated' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(updateProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle validation errors in updateProperty controller', async () => {
      updateProperty.mockImplementation((req, res) => res.status(400).json({ message: 'Validation error' }));

      const res = await supertest(app)
        .put('/properties/1')
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Validation error' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(updateProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('DELETE /properties/:propertyId', () => {
    it('should call the deleteProperty controller', async () => {
      deleteProperty.mockImplementation((req, res) => res.status(200).json({ message: 'Property deleted' }));

      const res = await supertest(app).delete('/properties/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Property deleted' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle not found errors in deleteProperty controller', async () => {
      deleteProperty.mockImplementation((req, res) => res.status(404).json({ message: 'Property not found' }));

      const res = await supertest(app).delete('/properties/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Property not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteProperty).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });
});
