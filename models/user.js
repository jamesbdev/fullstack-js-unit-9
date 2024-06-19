'use strict';
const { Model } = require('sequelize');

const Course = require("./course");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter a value for 'firstName'",
        },
        notEmpty: {
          msg: "Please enter a value for 'firstName'"
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter a value for 'lastName'",
        },
        notEmpty: {
          msg: "Please enter a value for 'lastName'",
        },
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter a value for 'emailAddress.'",
        },
        notEmpty: {
          msg: "Please enter a value for 'emailAddress.",
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Please enter a value for 'password'.",
        },
        notEmpty: {
          msg: "Please enter a value for 'password'.",
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};