const express = require('express');
const supertest = require('supertest');
const bodyParser = require('body-parser');
const documentRoutes = require('../routes/documentRoutes');
const upload = require('../middleware/file_uploads');
const authenticateToken = require('../middleware/authMiddleware');
const {
  addDocument,
  getAllDocuments,
  deleteDocument,
} = require('../controllers/documentController');

// Mock middleware and controllers
jest.mock('../middleware/file_uploads', () => ({
  single: jest.fn(() => (req, res, next) => next()),
}));
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => next()));
jest.mock('../controllers/documentController', () => ({
  addDocument: jest.fn(),
  getAllDocuments: jest.fn(),
  deleteDocument: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/documents', documentRoutes);

describe('Document Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe('GET /documents', () => {
    it('should call the getAllDocuments controller', async () => {
      getAllDocuments.mockImplementation((req, res) => res.status(200).json([{ document_id: 1, file_name: 'file1.pdf' }]));

      const res = await supertest(app).get('/documents');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ document_id: 1, file_name: 'file1.pdf' }]);
      expect(authenticateToken).toHaveBeenCalled();
      expect(getAllDocuments).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('POST /documents', () => {
    it('should call the addDocument controller for a valid file upload', async () => {
      addDocument.mockImplementation((req, res) => res.status(201).json({ message: 'Document added', document_id: 1 }));

      const res = await supertest(app)
        .post('/documents')
        .attach('file', Buffer.from('test content'), { filename: 'testfile.pdf', contentType: 'application/pdf' });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'Document added', document_id: 1 });
      expect(authenticateToken).toHaveBeenCalled();
      expect(upload.single).toHaveBeenCalledWith('file');
      expect(addDocument).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle errors during file upload', async () => {
      addDocument.mockImplementation((req, res) => res.status(400).json({ message: 'Invalid file' }));

      const res = await supertest(app).post('/documents').send();

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid file' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(upload.single).toHaveBeenCalledWith('file');
      expect(addDocument).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });

  describe('DELETE /documents/:document_id', () => {
    it('should call the deleteDocument controller', async () => {
      deleteDocument.mockImplementation((req, res) => res.status(200).json({ message: 'Document deleted' }));

      const res = await supertest(app).delete('/documents/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Document deleted' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteDocument).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });

    it('should handle errors in the deleteDocument controller', async () => {
      deleteDocument.mockImplementation((req, res) => res.status(404).json({ message: 'Document not found' }));

      const res = await supertest(app).delete('/documents/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: 'Document not found' });
      expect(authenticateToken).toHaveBeenCalled();
      expect(deleteDocument).toHaveBeenCalledWith(expect.any(Object), expect.any(Object));
    });
  });
});
