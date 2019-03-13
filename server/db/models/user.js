const Sequelize = require('sequelize');
const db = require('../db');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password');
    },
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt');
    },
  },
  googleId: {
    type: Sequelize.STRING,
  },
});

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = async function(candidatePwd) {
  const isMatch = await bcrypt.compare(candidatePwd, this.password);
  return isMatch;
};

/**
 * classMethods
 */
User.generateSalt = function() {
  return bcrypt.genSalt(SALT_WORK_FACTOR);
};

User.encryptPassword = function(plainTextPassword, salt) {
  return bcrypt.hash(plainTextPassword, salt);
};

/**
 * hooks
 */
const setSaltAndPassword = async user => {
  if (user.changed('password')) {
    user.salt = await User.generateSalt();
    user.password = await User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
