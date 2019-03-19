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

// employees -> addresses: 1 -> M
Employees.belongsTo(Address)
Address.hasMany(Employees)

// employees -> rolesHistory: 1 -> M
Employees.belongsTo(RoleHistory)
RoleHistory.hasMany(Employees)

// employees -> departments: 1 -> M
Employees.belongsTo(Departments)
Departments.hasMany(Employees)

// employees -> timeOff: 1 -> M
Employees.belongsTo(TimeOff)
TimeOff.hasMany(Employees)

// employees -> ratings: 1 -> M
Employees.belongsTo(Ratings)
Ratings.hasMany(Employees)

// employees (managerId) -> employees: 1 -> M ???

// roles -> employees: 1 -> M
Roles.belongsTo(Employees)
Employees.hasMany(Roles)

// departments -> roles: 1 -> M
Departments.belongsTo(Roles)
Roles.hasMany(Departments)

module.exports = { Address, Departments, Employees, Ratings, RoleHistory, Roles, TimeOff };