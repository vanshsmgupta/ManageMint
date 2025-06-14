const { Model, DataTypes } = require('sequelize');

class Offer extends Model {
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
        },
        allowNull: false
      },
      marketerId: {
        type: DataTypes.UUID,
        references: {
          model: 'Marketers',
          key: 'id'
        },
        allowNull: false
      },
      technology: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE
      },
      resume: {
        type: DataTypes.STRING,
        allowNull: false
      },
      timesheet: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'ongoing', 'completed'),
        defaultValue: 'pending'
      },
      validUntil: {
        type: DataTypes.DATE,
        allowNull: false
      },
      terms: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
      },
      attachments: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      responseDate: {
        type: DataTypes.DATE
      },
      responseNotes: {
        type: DataTypes.TEXT
      }
    }, {
      sequelize,
      modelName: 'Offer',
      timestamps: true,
      indexes: [
        { fields: ['marketerId'] },
        { fields: ['consultantId'] },
        { fields: ['status'] },
        { fields: ['startDate'] },
        { fields: ['clientId'] },
        { fields: ['technology'] },
        { fields: ['validUntil'] }
      ]
    });
  }
}

module.exports = Offer; 