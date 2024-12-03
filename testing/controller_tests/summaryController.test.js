const { User, Property, Project, Document } = require('../../models');
const summaryController = require('../../summaryController');
const httpMocks = require('node-mocks-http');

jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

describe('Summary Controller', () => {
  describe('getPropertySummary', () => {
    it('should return the user profile summary with properties, projects, and documents', async () => {
      const mockUser = {
        user_id: 1,
        username: 'testuser',
        Properties: [
          {
            property_id: 101,
            name: 'Property A',
            created_at: '2024-11-29',
            Projects: [
              {
                project_id: 201,
                name: 'Project X',
                completion_date: '2024-12-31',
                created_at: '2024-11-15',
                Documents: [
                  {
                    document_id: 301,
                    file_name: 'file1.pdf',
                    file_path: '/files/file1.pdf',
                    created_at: '2024-11-16',
                  },
                ],
              },
            ],
          },
        ],
      };

      User.findOne.mockResolvedValue(mockUser);

      const req = httpMocks.createRequest({
        user: { userId: 1 }, // Simulating payload with userId
      });
      const res = httpMocks.createResponse();

      await summaryController.getPropertySummary(req, res);

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(mockUser);
      expect(User.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
        include: {
          model: Property,
          include: {
            model: Project,
            include: {
              model: Document,
              attributes: ['document_id', 'file_name', 'file_path', 'created_at'],
            },
            attributes: ['project_id', 'name', 'completion_date', 'created_at'],
          },
          attributes: ['property_id', 'name', 'created_at'],
        },
        attributes: ['user_id', 'username'],
      });
    });

    it('should return 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null); // Simulating no user found

      const req = httpMocks.createRequest({
        user: { userId: 1 }, // Simulating payload with userId
      });
      const res = httpMocks.createResponse();

      await summaryController.getPropertySummary(req, res);

      expect(res.statusCode).toBe(404);
      expect(JSON.parse(res._getData())).toHaveProperty('message', 'User not found or unauthorized');
    });

    it('should handle errors when fetching the user profile summary', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const req = httpMocks.createRequest({
        user: { userId: 1 }, // Simulating payload with userId
      });
      const res = httpMocks.createResponse();

      await summaryController.getPropertySummary(req, res);

      expect(res.statusCode).toBe(500);
      const response = JSON.parse(res._getData());
      expect(response).toHaveProperty('message', 'Error fetching profile summary');
      expect(response).toHaveProperty('error', 'Database error');
    });
  });
});
