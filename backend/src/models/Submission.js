const { Model, DataTypes } = require('sequelize');

class Submission extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      consultantId: {
        type: DataTypes.UUID,
        references: {
          model: 'Consultants',
          key: 'id'
        },
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
        defaultValue: 'Pending'
      },
      clientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Clients',
          key: 'id'
        },
        allowNull: false
      },
      vendorId: {
        type: DataTypes.UUID,
        references: {
          model: 'Vendors',
          key: 'id'
        }
      },
      pocId: {
        type: DataTypes.UUID,
        references: {
          model: 'POCs',
          key: 'id'
        }
      },
      marketerId: {
        type: DataTypes.UUID,
        references: {
          model: 'Marketers',
          key: 'id'
        },
        allowNull: false
      },
      employerCompany: {
        type: DataTypes.STRING
      },
      rate: {
        type: DataTypes.STRING
      },
      location: {
        type: DataTypes.STRING
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'Submission'
    });
  }
}

module.exports = Submission; 