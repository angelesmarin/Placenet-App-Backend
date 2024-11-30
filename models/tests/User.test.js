const { Sequelize } = require('sequelize');
const User = require('../models/User');

describe('User Model', () => {
  let sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false }); // In-memory database
    await sequelize.authenticate();

    // Initialize the User model with the in-memory database
    User.init(User.rawAttributes, { sequelize, modelName: 'User', tableName: 'users' });

    await sequelize.sync({ force: true }); // Sync the database
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Field Validations', () => {
    it('should create a user with valid data', async () => {
      const user = await User.create({
        username: 'testuser',
        password_hash: 'hashedpassword',
      });

      expect(user).toHaveProperty('user_id');
      expect(user.username).toBe('testuser');
      expect(user.password_hash).toBe('hashedpassword');
    });

    it('should enforce the presence of required fields', async () => {
      await expect(User.create({ username: 'missingpassword' })).rejects.toThrow();
      await expect(User.create({ password_hash: 'missingusername' })).rejects.toThrow();
    });

    it('should reject usernames longer than 50 characters', async () => {
      const longUsername = 'a'.repeat(51); // 51 characters
      await expect(
        User.create({ username: longUsername, password_hash: 'hashedpassword' })
      ).rejects.toThrow();
    });
  });

  describe('Unique Constraints', () => {
    it('should enforce unique usernames', async () => {
      await User.create({
        username: 'uniqueuser',
        password_hash: 'hashedpassword',
      });

      await expect(
        User.create({
          username: 'uniqueuser',
          password_hash: 'anotherpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('Default Values', () => {
    it('should set the created_at field to the current timestamp by default', async () => {
      const user = await User.create({
        username: 'timestampuser',
        password_hash: 'hashedpassword',
      });

      expect(user.created_at).toBeDefined();
      expect(new Date(user.created_at).getTime()).toBeLessThanOrEqual(new Date().getTime());
    });
  });

  describe('Data Integrity', () => {
    it('should handle large numbers of user records without issue', async () => {
      const users = [];
      for (let i = 0; i < 1000; i++) {
        users.push({ username: `user${i}`, password_hash: 'hashedpassword' });
      }
      await User.bulkCreate(users);

      const count = await User.count();
      expect(count).toBe(1000);
    });
  });
});
