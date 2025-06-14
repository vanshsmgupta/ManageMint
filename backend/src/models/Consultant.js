const { Model, DataTypes } = require('sequelize');

class Consultant extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('Marketing', 'Submitted', 'Assessment', 'Offered', 'Placed'),
        defaultValue: 'Marketing'
      },
      keySkills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      usEntry: {
        type: DataTypes.DATE
      },
      ssn: {
        type: DataTypes.STRING,
        unique: true
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false
      },
      marketerId: {
        type: DataTypes.UUID,
        references: {
          model: 'Marketers',
          key: 'id'
        }
      },
      lastComment: {
        type: DataTypes.TEXT
      },
      isTeamConsultant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      modelName: 'Consultant'
    });
  }
}

module.exports = Consultant; 