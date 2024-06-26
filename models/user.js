'use strict';
const { Model } = require('sequelize');

const bcrypt = require('bcryptjs');

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
     
      unique: {
        msg: "Sorry, this email is already in use. Please use another email."
      },
      validate: {
        notNull: {
          msg: "Please enter a value for 'emailAddress.'",
        },
        is: {
          args: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/],
          msg: "Please check the format of the email address provided."
        },
        notEmpty: {
          msg: "Please enter a value for 'emailAddress.",
        }, //email regex from project 3 - form validation
       
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
      },
      set(value) {
          const hashedPassword = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hashedPassword);
        
      },
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if(user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });
  return User;
};