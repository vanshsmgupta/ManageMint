const { Model, DataTypes } = require('sequelize');

class Client extends Model {
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
        defaultValue: 'Client'
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
      modelName: 'Client'
    });
  }
}

module.exports = Client; 