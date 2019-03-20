const Address = require('./address');
const Departments = require('./departments');
const Employees = require('./employees');
const Ratings = require('./ratings');
const RoleHistory = require('./roleHistory');
const Roles = require('./roles');
const TimeOff = require('./timeoff');


// Sync
Address.sync();
Departments.sync();
Employees.sync();
Ratings.sync();
RoleHistory.sync();
Roles.sync();
TimeOff.sync();

// Associations

// addresses -> employees: 1 -> M
Address.belongsTo(Employees)
Employees.hasMany(Address)

// employees -> roles: 1 -> M
Employees.belongsTo(Roles)
Roles.hasMany(Employees)

// employees -> departments: 1 -> M
Employees.belongsTo(Departments)
Departments.hasMany(Employees)

// ratings -> employees: 1 -> M
Ratings.belongsTo(Employees)
Employees.hasMany(Ratings)

// rolehistory -> roles: 1 -> M
RoleHistory.belongsTo(Roles)
Roles.hasMany(RoleHistory)

// rolehistory -> departments: 1 -> M
RoleHistory.belongsTo(Departments)
Departments.hasMany(RoleHistory)

// rolehistory -> employees: 1 -> M
RoleHistory.belongsTo(Employees)
Employees.hasMany(RoleHistory)

// departments -> roles: 1 -> M
Roles.belongsTo(Departments)
Departments.hasMany(Roles)

// timeOff -> employees: 1 -> M
TimeOff.belongsTo(Employees)
Employees.hasMany(TimeOff)

module.exports = { Address, Departments, Employees, Ratings, RoleHistory, Roles, TimeOff };