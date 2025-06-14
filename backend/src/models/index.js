const { Sequelize } = require('sequelize');
const config = require('../config/database');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'marketer_ui',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const Marketer = require('./Marketer');
const Consultant = require('./Consultant');
const Profile = require('./Profile');
const Client = require('./Client');
const Vendor = require('./Vendor');
const POC = require('./POC');
const IP = require('./IP');
const Submission = require('./Submission');
const Assessment = require('./Assessment');
const Offer = require('./Offer');

// Initialize models
const models = {
  Marketer: Marketer.init(sequelize),
  Consultant: Consultant.init(sequelize),
  Profile: Profile.init(sequelize),
  Client: Client.init(sequelize),
  Vendor: Vendor.init(sequelize),
  POC: POC.init(sequelize),
  IP: IP.init(sequelize),
  Submission: Submission.init(sequelize),
  Assessment: Assessment.init(sequelize),
  Offer: Offer.init(sequelize)
};

// Set up associations
Object.values(models)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(models));

// Marketer Relationships
models.Marketer.hasMany(models.Consultant);
models.Marketer.hasMany(models.Submission);
models.Marketer.hasMany(models.Assessment);
models.Marketer.hasMany(models.Offer);

// Consultant Relationships
models.Consultant.belongsTo(models.Marketer);
models.Consultant.hasOne(models.Profile);
models.Consultant.hasMany(models.Submission);
models.Consultant.hasMany(models.Assessment);
models.Consultant.hasMany(models.Offer);

// Profile Relationships
models.Profile.belongsTo(models.Consultant);

// Client Relationships
models.Client.hasMany(models.POC);
models.Client.hasMany(models.Submission);
models.Client.hasMany(models.Assessment);
models.Client.hasMany(models.Offer);

// Vendor Relationships
models.Vendor.hasMany(models.Submission);
models.Vendor.hasMany(models.Offer);

// POC Relationships
models.POC.belongsTo(models.Client);
models.POC.hasMany(models.Submission);

// IP Relationships
models.IP.hasMany(models.Submission);
models.IP.hasMany(models.Offer);

// Submission Relationships
models.Submission.belongsTo(models.Consultant);
models.Submission.belongsTo(models.Client);
models.Submission.belongsTo(models.Vendor);
models.Submission.belongsTo(models.POC);
models.Submission.belongsTo(models.Marketer);

// Assessment Relationships
models.Assessment.belongsTo(models.Consultant);
models.Assessment.belongsTo(models.Client);

// Offer Relationships
models.Offer.belongsTo(models.Consultant);
models.Offer.belongsTo(models.Marketer);
models.Offer.belongsTo(models.Vendor);
models.Offer.belongsTo(models.Client);

module.exports = {
  sequelize,
  ...models
}; 