const { Document, Project, Property } = require('../../models');
const documentController = require('../../documentController');
const httpMocks = require('node-mocks-http');
const path = require('path');
const fs = require('fs');

// Mock models and file system
jest.mock('../../models', () => ({
  Document: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Project: {
    findOne: jest.fn(),
  },
  Property: {},
}));

jest.mock('fs', () => ({
  unlink: jest.fn(),
}));

describe('Document Controller', () => {
  describe('addDocument', () => {
    it('should upload a document and save it to the database', async () => {
      const mockProject = { project_id: 1 };
      const mockDocument = {
        document_id: 1,
        file_name: 'example.pdf',
        file_path: 'uploads/example.pdf',
      };

      Project.findOne.mockResolvedValue(mockProject);
      Document.create.mockResolvedValue(mockDocument);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        file: { originalname: 'example.pdf', filename: 'example.pdf' },
        body: { project_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.addDocument(req, res);

      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        message: 'Document uploaded successfully',
        document: mockDocument,
      });
      expect(Project.findOne).toHaveBeenCalledWith({
        where: { project_id: 1 },
        include: {
          model: Property,
          where: { user_id: 1 },
        },
      });
      expect(Document.create).toHaveBeenCalledWith({
        project_id: 1,
        user_id: 1,
        file_name: 'example.pdf',
        file_path: path.join('uploads', 'example.pdf'),
      });
    });

    it('should return 400 if no file is provided', async () => {
      const req = httpMocks.createRequest({
        user: { userId: 1 },
        body: { project_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.addDocument(req, res);

      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Missing or incorrect file type. Please upload a PDF!');
    });

    it('should return 403 if the user is not authorized to upload documents to the project', async () => {
      Project.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        file: { originalname: 'example.pdf', filename: 'example.pdf' },
        body: { project_id: 2 },
      });
      const res = httpMocks.createResponse();

      await documentController.addDocument(req, res);

      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'not authorized to upload documents to project');
    });

    it('should handle errors when uploading a document', async () => {
      Project.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        file: { originalname: 'example.pdf', filename: 'example.pdf' },
        body: { project_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.addDocument(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error uploading document');
    });
  });

  describe('getAllDocuments', () => {
    it('should return all documents for the user', async () => {
      const mockDocuments = [
        { document_id: 1, file_name: 'doc1.pdf' },
        { document_id: 2, file_name: 'doc2.pdf' },
      ];
      Document.findAll.mockResolvedValue(mockDocuments);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.getAllDocuments(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockDocuments);
      expect(Document.findAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: {
          model: Project,
          include: {
            model: Property,
            where: { user_id: 1 },
          },
        },
      });
    });

    it('should handle errors when retrieving documents', async () => {
      Document.findAll.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.getAllDocuments(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error retrieving documents');
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document and remove the file from the server', async () => {
      const mockDocument = { document_id: 1, file_path: 'uploads/example.pdf' };
      Document.findOne.mockResolvedValue(mockDocument);
      fs.unlink.mockImplementation((filePath, callback) => callback(null));
      Document.destroy.mockResolvedValue();

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { document_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.deleteDocument(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Document deleted successfully');
      expect(fs.unlink).toHaveBeenCalledWith(path.resolve(mockDocument.file_path), expect.any(Function));
      expect(Document.destroy).toHaveBeenCalledWith({ where: { document_id: 1 } });
    });

    it('should return 404 if the document is not found', async () => {
      Document.findOne.mockResolvedValue(null);

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { document_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.deleteDocument(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Document not found or not authorized to delete');
    });

    it('should handle errors when deleting a document', async () => {
      Document.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { document_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.deleteDocument(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error deleting document');
    });

    it('should handle errors when deleting a file from the server', async () => {
      const mockDocument = { document_id: 1, file_path: 'uploads/example.pdf' };
      Document.findOne.mockResolvedValue(mockDocument);
      fs.unlink.mockImplementation((filePath, callback) => callback(new Error('File system error')));

      const req = httpMocks.createRequest({
        user: { userId: 1 },
        params: { document_id: 1 },
      });
      const res = httpMocks.createResponse();

      await documentController.deleteDocument(req, res);

      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'Error deleting file from server');
    });
  });
});
