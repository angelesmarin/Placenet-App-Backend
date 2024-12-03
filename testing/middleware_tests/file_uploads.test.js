const multer = require('multer');
const upload = require('../../file_uploads');
const httpMocks = require('node-mocks-http');
const fs = require('fs');
const path = require('path');

// Mock the filesystem and path to simulate uploaded files
jest.mock('fs');
jest.mock('path');

describe('File Uploads Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('should accept a valid PDF file', (done) => {
    const middleware = upload.single('file');

    req.file = {
      originalname: 'testfile.pdf',
      mimetype: 'application/pdf',
    };

    middleware(req, res, (err) => {
      expect(err).toBeUndefined();
      expect(req.file).toHaveProperty('filename');
      expect(req.file.filename).toMatch(/^\d+-\d+-testfile\.pdf$/); // Check for unique filename format
      expect(req.file.destination).toBe('uploads/');
      done();
    });
  });

  it('should reject non-PDF files', (done) => {
    const middleware = upload.single('file');

    req.file = {
      originalname: 'testfile.txt',
      mimetype: 'text/plain',
    };

    middleware(req, res, (err) => {
      expect(err).toBeDefined();
      expect(err.message).toBe('Please upload a PDF file!');
      done();
    });
  });

  it('should reject files larger than the size limit (10MB)', (done) => {
    const middleware = upload.single('file');

    req.file = {
      originalname: 'largefile.pdf',
      mimetype: 'application/pdf',
      size: 15 * 1024 * 1024, // 15MB
    };

    middleware(req, res, (err) => {
      expect(err).toBeDefined();
      expect(err.message).toContain('File too large');
      done();
    });
  });

  it('should correctly store the uploaded file with a unique filename', (done) => {
    const middleware = upload.single('file');

    req.file = {
      originalname: 'example.pdf',
      mimetype: 'application/pdf',
    };

    middleware(req, res, (err) => {
      expect(err).toBeUndefined();
      expect(req.file.filename).toMatch(/^\d+-\d+-example\.pdf$/); // Matches the unique filename format
      expect(req.file.destination).toBe('uploads/');
      done();
    });
  });

  it('should handle storage destination errors gracefully', (done) => {
    const mockStorage = multer.diskStorage({
      destination: (_, __, cb) => cb(new Error('Destination error'), null),
    });

    const mockUpload = multer({ storage: mockStorage });
    const middleware = mockUpload.single('file');

    middleware(req, res, (err) => {
      expect(err).toBeDefined();
      expect(err.message).toBe('Destination error');
      done();
    });
  });
});
