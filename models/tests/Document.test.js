const { Sequelize } = require('sequelize');
const Document = require('../models/Document');
const Project = require('../models/Project');
const User = require('../models/User');

describe('Document Model', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false }); // In-memory database
    await sequelize.authenticate();

    // Initialize models with the in-memory database
    User.init(User.rawAttributes, { sequelize, modelName: 'User', tableName: 'users' });
    Project.init(Project.rawAttributes, { sequelize, modelName: 'Project', tableName: 'projects' });
    Document.init(Document.rawAttributes, { sequelize, modelName: 'Document', tableName: 'documents' });

    // Define associations
    User.hasMany(Project, { foreignKey: 'user_id' });
    Project.belongsTo(User, { foreignKey: 'user_id' });
    Project.hasMany(Document, { foreignKey: 'project_id' });
    Document.belongsTo(Project, { foreignKey: 'project_id' });
    Document.belongsTo(User, { foreignKey: 'user_id' });

    await sequelize.sync({ force: true }); // Sync the database
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Field Validations', () => {
    it('should create a document with valid data', async () => {
      const user = await User.create({ user_id: 1, username: 'testuser', password_hash: 'hashedpassword' });
      const project = await Project.create({ project_id: 1, user_id: user.user_id, name: 'Test Project' });

      const document = await Document.create({
        project_id: project.project_id,
        user_id: user.user_id,
        file_name: 'example.pdf',
        file_path: 'uploads/example.pdf',
      });

      expect(document).toHaveProperty('document_id');
      expect(document.file_name).toBe('example.pdf');
      expect(document.file_path).toBe('uploads/example.pdf');
    });

    it('should enforce required fields', async () => {
      await expect(
        Document.create({
          file_name: 'example.pdf',
        })
      ).rejects.toThrow();
    });
  });

  describe('Associations', () => {
    it('should belong to a project', async () => {
      const user = await User.create({ user_id: 2, username: 'testuser2', password_hash: 'hashedpassword' });
      const project = await Project.create({ project_id: 2, user_id: user.user_id, name: 'Test Project 2' });

      const document = await Document.create({
        project_id: project.project_id,
        user_id: user.user_id,
        file_name: 'example2.pdf',
        file_path: 'uploads/example2.pdf',
      });

      const associatedProject = await document.getProject();
      expect(associatedProject.name).toBe('Test Project 2');
    });

    it('should belong to a user', async () => {
      const user = await User.create({ user_id: 3, username: 'testuser3', password_hash: 'hashedpassword' });
      const project = await Project.create({ project_id: 3, user_id: user.user_id, name: 'Test Project 3' });

      const document = await Document.create({
        project_id: project.project_id,
        user_id: user.user_id,
        file_name: 'example3.pdf',
        file_path: 'uploads/example3.pdf',
      });

      const associatedUser = await document.getUser();
      expect(associatedUser.username).toBe('testuser3');
    });
  });

  describe('Cascade Deletion', () => {
    it('should delete documents when the associated project is deleted', async () => {
      const user = await User.create({ user_id: 4, username: 'testuser4', password_hash: 'hashedpassword' });
      const project = await Project.create({ project_id: 4, user_id: user.user_id, name: 'Test Project 4' });

      const document = await Document.create({
        project_id: project.project_id,
        user_id: user.user_id,
        file_name: 'example4.pdf',
        file_path: 'uploads/example4.pdf',
      });

      await project.destroy(); // Cascade delete

      const foundDocument = await Document.findByPk(document.document_id);
      expect(foundDocument).toBeNull();
    });
  });
});
