const { Sequelize } = require('sequelize');
const Property = require('../../models/Property');
const User = require('../../models/User');

describe('Property Model', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false }); // In-memory database
    await sequelize.authenticate();

    // Initialize models with the in-memory database
    User.init(User.rawAttributes, { sequelize, modelName: 'User', tableName: 'users' });
    Property.init(Property.rawAttributes, { sequelize, modelName: 'Property', tableName: 'properties' });

    // Define associations
    User.hasMany(Property, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Property.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

    await sequelize.sync({ force: true }); // Sync the database
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Field Validations', () => {
    it('should create a property with valid data', async () => {
      const user = await User.create({ username: 'testuser', password_hash: 'hashedpassword' });

      const property = await Property.create({
        user_id: user.user_id,
        name: 'Test Property',
      });

      expect(property).toHaveProperty('property_id');
      expect(property.name).toBe('Test Property');
      expect(property.user_id).toBe(user.user_id);
    });

    it('should enforce required fields', async () => {
      await expect(Property.create({ name: 'Missing User ID' })).rejects.toThrow();
      await expect(Property.create({ user_id: 1 })).rejects.toThrow();
    });

    it('should enforce the presence of a user_id', async () => {
      await expect(Property.create({ name: 'No User ID' })).rejects.toThrow();
    });
  });

  describe('Associations', () => {
    it('should belong to a user', async () => {
      const user = await User.create({ username: 'testuser2', password_hash: 'hashedpassword' });

      const property = await Property.create({
        user_id: user.user_id,
        name: 'Test Property 2',
      });

      const associatedUser = await property.getUser();
      expect(associatedUser.username).toBe('testuser2');
    });

    it('should retrieve all properties for a user', async () => {
      const user = await User.create({ username: 'testuser3', password_hash: 'hashedpassword' });

      await Property.create({ user_id: user.user_id, name: 'Property A' });
      await Property.create({ user_id: user.user_id, name: 'Property B' });

      const properties = await user.getProperties();
      expect(properties.length).toBe(2);
      expect(properties.map((p) => p.name)).toContain('Property A');
      expect(properties.map((p) => p.name)).toContain('Property B');
    });
  });

  describe('Cascade Deletion', () => {
    it('should delete properties when the associated user is deleted', async () => {
      const user = await User.create({ username: 'cascadeuser', password_hash: 'hashedpassword' });

      const property = await Property.create({
        user_id: user.user_id,
        name: 'Cascade Property',
      });

      await user.destroy(); // Cascade delete

      const foundProperty = await Property.findByPk(property.property_id);
      expect(foundProperty).toBeNull();
    });
  });
});
