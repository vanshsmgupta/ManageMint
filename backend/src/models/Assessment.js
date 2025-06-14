const { Model, DataTypes } = require('sequelize');

class Assessment extends Model {
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
      interviewTimeSlot: {
        type: DataTypes.DATE,
        allowNull: false
      },
      assessmentType: {
        type: DataTypes.ENUM('Interview', 'Technical Test', 'Coding Challenge'),
        defaultValue: 'Interview'
      },
      status: {
        type: DataTypes.ENUM('Pending', 'Completed', 'Cancelled'),
        defaultValue: 'Pending'
      },
      attendees: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      clientId: {
        type: DataTypes.UUID,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      clientFeedback: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A'
      },
      intervieweeFeedback: {
        type: DataTypes.TEXT,
        defaultValue: 'N/A'
      },
      attachment: {
        type: DataTypes.STRING
      },
      meetingLink: {
        type: DataTypes.STRING
      }
    }, {
      sequelize,
      modelName: 'Assessment'
    });
  }
}

module.exports = Assessment; 