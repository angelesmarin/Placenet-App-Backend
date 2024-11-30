const { Property } = require('../models');
const propertyController = require('../propertyController');
const httpMocks = require('node-mocks-http');

jest.mock('../models', () => ({
  Property: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Property Controller', () => {
  describe('getAllProperties', () => {
    it('should return all properties for the user', async () => {
      const mockProperties = [
        { property_id: 1, name: 'Property A', user_id: 1 },
        { property_id: 2, name: 'Property B', user_id: 1 },
      ];
      Property.findAll.mockResolvedValue(mockProperties);

      const req = httpMocks.createRequest({
        user: { userId: 1 }, // Simulating payload with userId
      });
      const res = httpMocks.createResponse();

      await propertyController.getAllProperties(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockProperties);
      expect(Property.findAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
    });

    it('should handle errors when retrieving properties', async () => {
      Property.findAll.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.getAllProperties(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error getting properties');
    });
  });

  describe('getProperty', () => {
    it('should return a property if found and authorized', async () => {
      const mockProperty = { property_id: 1, name: 'Property A', user_id: 1 };
      Property.findOne.mockResolvedValue(mockProperty);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.getProperty(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockProperty);
      expect(Property.findOne).toHaveBeenCalledWith({
        where: { property_id: 1, user_id: 1 },
      });
    });

    it('should return 404 if property is not found or unauthorized', async () => {
      Property.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.getProperty(req, res);

      expect(res.statusCode).toBe(404);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Property not found or unauthorized');
    });

    it('should handle errors when retrieving a property', async () => {
      Property.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.getProperty(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error getting property');
    });
  });

  describe('createProperty', () => {
    it('should create a new property and return it', async () => {
      const mockProperty = { property_id: 1, name: 'Property A', user_id: 1 };
      Property.create.mockResolvedValue(mockProperty);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        body: { name: 'Property A' },
      });
      const res = httpMocks.createResponse();

      await propertyController.createProperty(req, res);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual(mockProperty);
      expect(Property.create).toHaveBeenCalledWith({
        user_id: 1,
        name: 'Property A',
      });
    });

    it('should handle errors when creating a property', async () => {
      Property.create.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        body: { name: 'Property A' },
      });
      const res = httpMocks.createResponse();

      await propertyController.createProperty(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error creating property');
    });
  });

  describe('updateProperty', () => {
    it('should update a property and return success message', async () => {
      const mockProperty = {
        property_id: 1,
        name: 'Property A',
        user_id: 1,
        update: jest.fn().mockResolvedValue(),
      };
      Property.findOne.mockResolvedValue(mockProperty);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
        body: { name: 'Updated Property' },
      });
      const res = httpMocks.createResponse();

      await propertyController.updateProperty(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Property updated successfully');
      expect(mockProperty.update).toHaveBeenCalledWith({ name: 'Updated Property' });
    });

    it('should return 404 if property to update is not found', async () => {
      Property.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
        body: { name: 'Updated Property' },
      });
      const res = httpMocks.createResponse();

      await propertyController.updateProperty(req, res);

      expect(res.statusCode).toBe(404);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Property not found or unauthorized');
    });

    it('should handle errors when updating a property', async () => {
      Property.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
        body: { name: 'Updated Property' },
      });
      const res = httpMocks.createResponse();

      await propertyController.updateProperty(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error updating property');
    });
  });

  describe('deleteProperty', () => {
    it('should delete a property and return success message', async () => {
      const mockProperty = {
        property_id: 1,
        name: 'Property A',
        user_id: 1,
        destroy: jest.fn().mockResolvedValue(),
      };
      Property.findOne.mockResolvedValue(mockProperty);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.deleteProperty(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Property deleted successfully');
      expect(mockProperty.destroy).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if property to delete is not found', async () => {
      Property.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.deleteProperty(req, res);

      expect(res.statusCode).toBe(404);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Property not found or unauthorized');
    });

    it('should handle errors when deleting a property', async () => {
      Property.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { propertyId: 1 },
      });
      const res = httpMocks.createResponse();

      await propertyController.deleteProperty(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error deleting property');
    });
  });
});
