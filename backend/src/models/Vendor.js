const { Model, DataTypes } = require('sequelize');

class Vendor extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      website: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true
        }
      },
      type: {
        type: DataTypes.STRING,
        defaultValue: 'Vendor'
      },
      street: {
        type: DataTypes.STRING
      },
      city: {
        type: DataTypes.STRING
      },
      state: {
        type: DataTypes.STRING
      }
    }, {
      sequelize,
      modelName: 'Vendor'
    });
  }
}

module.exports = Vendor; 