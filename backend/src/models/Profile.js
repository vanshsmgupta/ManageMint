const { Model, DataTypes } = require('sequelize');

class Profile extends Model {
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
      technologies: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      workAuth: {
        type: DataTypes.STRING,
        allowNull: false
      },
      marketingEmail: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      emailPassword: {
        type: DataTypes.STRING
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      adHoc: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      resumes: {
        type: DataTypes.STRING
      },
      educations: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'Profile'
    });
  }
}

module.exports = Profile; 