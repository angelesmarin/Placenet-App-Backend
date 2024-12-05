const { Sequelize } = require('sequelize');
const { User, Property, Project, Document } = require('../../index');

describe('Model Associations', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false }); // In-memory database
    await sequelize.authenticate();

    // Initialize models with the in-memory database
    User.init(User.rawAttributes, { sequelize, modelName: 'User', tableName: 'users' });
    Property.init(Property.rawAttributes, { sequelize, modelName: 'Property', tableName: 'properties' });
    Project.init(Project.rawAttributes, { sequelize, modelName: 'Project', tableName: 'projects' });
    Document.init(Document.rawAttributes, { sequelize, modelName: 'Document', tableName: 'documents' });

    // Reinitialize associations
    require('../index'); // This ensures the associations from index.js are set up

    await sequelize.sync({ force: true }); // Sync the database
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('User and Property Associations', () => {
    it('should associate a User with multiple Properties', async () => {
      const user = await User.create({ username: 'testuser', password_hash: 'hashedpassword' });
      const property1 = await Property.create({ user_id: user.user_id, name: 'Property 1' });
      const property2 = await Property.create({ user_id: user.user_id, name: 'Property 2' });

      const userProperties = await user.getProperties();
      expect(userProperties.length).toBe(2);
      expect(userProperties.map((p) => p.name)).toContain('Property 1');
      expect(userProperties.map((p) => p.name)).toContain('Property 2');
    });

    it('should cascade delete Properties when a User is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser', password_hash: 'hashedpassword' });
      await Property.create({ user_id: user.user_id, name: 'Cascade Property' });

      await user.destroy();

      const properties = await Property.findAll({ where: { user_id: user.user_id } });
      expect(properties.length).toBe(0);
    });
  });

  describe('Property and Project Associations', () => {
    it('should associate a Property with multiple Projects', async () => {
      const user = await User.create({ username: 'testuser2', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Test Property' });
      const project1 = await Project.create({ property_id: property.property_id, name: 'Project 1' });
      const project2 = await Project.create({ property_id: property.property_id, name: 'Project 2' });

      const propertyProjects = await property.getProjects();
      expect(propertyProjects.length).toBe(2);
      expect(propertyProjects.map((p) => p.name)).toContain('Project 1');
      expect(propertyProjects.map((p) => p.name)).toContain('Project 2');
    });

    it('should cascade delete Projects when a Property is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser2', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Cascade Property' });
      await Project.create({ property_id: property.property_id, name: 'Cascade Project' });

      await property.destroy();

      const projects = await Project.findAll({ where: { property_id: property.property_id } });
      expect(projects.length).toBe(0);
    });
  });

  describe('Project and Document Associations', () => {
    it('should associate a Project with multiple Documents', async () => {
      const user = await User.create({ username: 'testuser3', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Test Property 3' });
      const project = await Project.create({ property_id: property.property_id, name: 'Test Project' });
      const document1 = await Document.create({ project_id: project.project_id, user_id: user.user_id, file_name: 'Doc 1', file_path: 'uploads/doc1.pdf' });
      const document2 = await Document.create({ project_id: project.project_id, user_id: user.user_id, file_name: 'Doc 2', file_path: 'uploads/doc2.pdf' });

      const projectDocuments = await project.getDocuments();
      expect(projectDocuments.length).toBe(2);
      expect(projectDocuments.map((d) => d.file_name)).toContain('Doc 1');
      expect(projectDocuments.map((d) => d.file_name)).toContain('Doc 2');
    });

    it('should cascade delete Documents when a Project is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser3', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Cascade Property 3' });
      const project = await Project.create({ property_id: property.property_id, name: 'Cascade Project' });
      await Document.create({ project_id: project.project_id, user_id: user.user_id, file_name: 'Cascade Doc', file_path: 'uploads/cascade.pdf' });

      await project.destroy();

      const documents = await Document.findAll({ where: { project_id: project.project_id } });
      expect(documents.length).toBe(0);
    });
  });

  describe('Direct Document and User Association', () => {
    it('should associate a Document with a User', async () => {
      const user = await User.create({ username: 'testuser4', password_hash: 'hashedpassword' });
      const document = await Document.create({ user_id: user.user_id, file_name: 'User Doc', file_path: 'uploads/userdoc.pdf' });

      const associatedUser = await document.getUser();
      expect(associatedUser.username).toBe('testuser4');
    });

    it('should cascade delete Documents when a User is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser4', password_hash: 'hashedpassword' });
      await Document.create({ user_id: user.user_id, file_name: 'Cascade User Doc', file_path: 'uploads/cascadeuserdoc.pdf' });

      await user.destroy();

      const documents = await Document.findAll({ where: { user_id: user.user_id } });
      expect(documents.length).toBe(0);
    });
  });
});
