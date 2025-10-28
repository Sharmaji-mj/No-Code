// // const { Sequelize } = require('sequelize');
// const path = require('path');

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: path.join(__dirname, '../../database.sqlite'),
//   logging: console.log,
//   define: {
//     timestamps: true,
//     underscored: true,
//     // freezeTableName: true,  <-- This line must be removed or commented out
//   },
// });

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('SQLite connection has been established successfully.');
//     await sequelize.sync({ force: false }); // Keep this as false
//     console.log('Database synchronized');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };

// module.exports = { sequelize, connectDB };

// backend/src/config/database.js

// // THIS IS THE LINE THAT WAS MISSING
// const { Sequelize } = require('sequelize'); 
// const path = require('path');

// // Create a SQLite database connection
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: path.join(__dirname, '../../database.sqlite'),
//   logging: console.log, // Set to false to disable logging
//   define: {
//     timestamps: true,
//     underscored: true,
//     // freezeTableName: true, // This line must be removed or commented out
//   },
// });



// // const connectDB = async () => {
// //   try {
// //     await sequelize.authenticate();
// //     console.log('SQLite connection has been established successfully.');
    
// //     // TEMPORARILY CHANGE THIS TO TRUE
// //     await sequelize.sync({ force: false }); 
// //     console.log('Database synchronized (tables dropped and recreated)');
// //   } catch (error) {
// //     console.error('Unable to connect to the database:', error);
// //   }
// // };

// // module.exports = { sequelize, connectDB };

// // backend/src/config/database.js

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('SQLite connection has been established successfully.');
    
//     await sequelize.sync({ force: false }); 
    
//     // CHANGE THIS LINE
//     console.log('Database synchronized successfully.'); // This is more accurate
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// };
// module.exports = { sequelize, connectDB };


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:mj_postgre@db:5432/codeAlchemy', {
  dialect: 'postgres',
  logging: console.log, // or false to disable logs
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Postgres connection has been established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB };
