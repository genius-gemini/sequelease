'use strict';

const db = require('../server/db/db');
const { User } = require('../server/db/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db synced!');

  const users = await Promise.all([
    User.create({
      email: 'cody@email.com',
      password: '123',
      firstName: 'cody',
      lastName: 'dog',
      phone: '(123) 456-7899',
      isAdmin: true,
    }),
    User.create({
      email: 'murphy@email.com',
      password: '123',
      firstName: 'murphy',
      lastName: 'dog',
    }),
  ]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
}

const db2 = require('../server/db2/db2');
const { Address, Departments, Employees, Ratings, RoleHistory, Roles, TimeOff } = require('../server/db2/models')
const { AddressSeedData, DepartmentsSeedData, EmployeesSeedData, RatingsSeedData, RoleHistorySeedData, RolesSeedData, TimeOffSeedData } = require('./db2SeedData')


async function seed2() {
  await db2.sync({ force: true });
  console.log('db2 synced!');

  const addressData = await Promise.all(AddressSeedData.map(address => Address.create(address)))
  const departmentsData = await Promise.all(DepartmentsSeedData.map(department => Departments.create(department)))
  const employeesData = await Promise.all(EmployeesSeedData.map(employee => Employees.create(employee)))
  const ratingsData = await Promise.all(RatingsSeedData.map(rating => Ratings.create(rating)))
  const rolehistoryData = await Promise.all(RoleHistorySeedData.map(rolehistory => RoleHistory.create(rolehistory)))
  const roleData = await Promise.all(RolesSeedData.map(role => Roles.create(role)))
  const timeoffData = await Promise.all(TimeOffSeedData.map(timeoff => TimeOff.create(timeoff)))


  console.log(`seeded ${addressData.length} addresses`)
  console.log(`seeded ${departmentsData.length} departments`)
  console.log(`seeded ${employeesData.length} employees`)
  console.log(`seeded ${ratingsData.length} ratings`)
  console.log(`seeded ${rolehistoryData.length} rolehistories`)
  console.log(`seeded ${roleData.length} roles`)
  console.log(`seeded ${timeoffData.length} roles`)

  console.log(`seeded successfully`);
}


// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
    await seed2()
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
