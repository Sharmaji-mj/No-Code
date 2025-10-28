'use strict';

module.exports = {
  async up (queryInterface) {
    // Convert ENUM columns to TEXT for flexibility
    await queryInterface.sequelize.query(
      `ALTER TABLE "projects" ALTER COLUMN "type" TYPE text USING "type"::text;`
    );
    await queryInterface.sequelize.query(
      `ALTER TABLE "projects" ALTER COLUMN "status" TYPE text USING "status"::text;`
    );
  },

  async down () {
    // No downgrade — ENUM recreation is messy during development
  }
};
