const { Model, DataTypes } = require('sequelize');

class POC extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      contactName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING
      },
      alternatePhone: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      type: {
        type: DataTypes.ENUM('Billing', 'Time-sheet', 'Recruiter', 'Other'),
        allowNull: false
      },
      position: {
        type: DataTypes.STRING
      },
      clientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Clients',
          key: 'id'
        },
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'POC'
    });
  }
}

module.exports = POC; 