const { Sequelize } = require('sequelize');
const Project = require('../../models/Project');
const Property = require('../../models/Property');
const User = require('../../models/User');

describe('Project Model', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false }); // In-memory database
    await sequelize.authenticate();

    // Initialize models with the in-memory database
    User.init(User.rawAttributes, { sequelize, modelName: 'User', tableName: 'users' });
    Property.init(Property.rawAttributes, { sequelize, modelName: 'Property', tableName: 'properties' });
    Project.init(Project.rawAttributes, { sequelize, modelName: 'Project', tableName: 'projects' });

    // Define associations
    User.hasMany(Property, { foreignKey: 'user_id' });
    Property.belongsTo(User, { foreignKey: 'user_id' });
    Property.hasMany(Project, { foreignKey: 'property_id' });
    Project.belongsTo(Property, { foreignKey: 'property_id' });
    Project.belongsTo(User, { foreignKey: 'user_id' });

    await sequelize.sync({ force: true }); // Sync the database
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Field Validations', () => {
    it('should create a project with valid data', async () => {
      const user = await User.create({ username: 'testuser', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Test Property' });

      const project = await Project.create({
        property_id: property.property_id,
        user_id: user.user_id,
        name: 'Test Project',
        description: 'This is a test project',
        completion_date: '2024-12-31',
      });

      expect(project).toHaveProperty('project_id');
      expect(project.name).toBe('Test Project');
      expect(project.description).toBe('This is a test project');
      expect(new Date(project.completion_date).toISOString()).toBe('2024-12-31T00:00:00.000Z');
    });

    it('should enforce required fields', async () => {
      await expect(
        Project.create({
          description: 'Missing name field',
        })
      ).rejects.toThrow();
    });

    it('should allow null for optional fields', async () => {
      const user = await User.create({ username: 'testuser2', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Test Property 2' });

      const project = await Project.create({
        property_id: property.property_id,
        user_id: user.user_id,
        name: 'Test Project 2',
      });

      expect(project).toHaveProperty('project_id');
      expect(project.description).toBeNull();
      expect(project.completion_date).toBeNull();
    });
  });

  describe('Associations', () => {
    it('should belong to a property', async () => {
      const user = await User.create({ username: 'testuser3', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Test Property 3' });

      const project = await Project.create({
        property_id: property.property_id,
        user_id: user.user_id,
        name: 'Test Project 3',
      });

      const associatedProperty = await project.getProperty();
      expect(associatedProperty.name).toBe('Test Property 3');
    });

    it('should belong to a user', async () => {
      const user = await User.create({ username: 'testuser4', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Test Property 4' });

      const project = await Project.create({
        property_id: property.property_id,
        user_id: user.user_id,
        name: 'Test Project 4',
      });

      const associatedUser = await project.getUser();
      expect(associatedUser.username).toBe('testuser4');
    });
  });

  describe('Cascade Deletion', () => {
    it('should delete projects when the associated property is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Cascade Property' });

      const project = await Project.create({
        property_id: property.property_id,
        user_id: user.user_id,
        name: 'Cascade Project',
      });

      await property.destroy(); // Cascade delete

      const foundProject = await Project.findByPk(project.project_id);
      expect(foundProject).toBeNull();
    });

    it('should delete projects when the associated user is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser2', password_hash: 'hashedpassword' });
      const property = await Property.create({ user_id: user.user_id, name: 'Cascade Property 2' });

      const project = await Project.create({
        property_id: property.property_id,
        user_id: user.user_id,
        name: 'Cascade Project 2',
      });

      await user.destroy(); // Cascade delete

      const foundProject = await Project.findByPk(project.project_id);
      expect(foundProject).toBeNull();
    });
  });
});
