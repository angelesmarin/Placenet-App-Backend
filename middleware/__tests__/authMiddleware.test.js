const jwt = require('jsonwebtoken');
const authenticateToken = require('../authMiddleware');
const httpMocks = require('node-mocks-http');

jest.mock('jsonwebtoken');

describe('authenticateToken Middleware', () => {
  it('should call next() if the token is valid', () => {
    const mockDecoded = { userId: 1 }; // Mock decoded payload
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockDecoded);
    });

    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer validtoken' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET, expect.any(Function));
    expect(req.user).toEqual(mockDecoded); // `req.user` should be the decoded token
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if no token is provided', () => {
    const req = httpMocks.createRequest({
      headers: { authorization: '' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res._getData())).toHaveProperty('message', 'Token required for authentication');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 403 if the token is invalid or expired', () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    const req = httpMocks.createRequest({
      headers: { authorization: 'Bearer invalidtoken' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(JSON.parse(res._getData())).toHaveProperty('message', 'Invalid or expired token');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the authorization header is missing', () => {
    const req = httpMocks.createRequest({});
    const res = httpMocks.createResponse();
    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res._getData())).toHaveProperty('message', 'Token required for authentication');
    expect(next).not.toHaveBeenCalled();
  });
});
