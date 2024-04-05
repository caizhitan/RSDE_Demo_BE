"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      {
        tableName: "users",
        schema: process.env.RSDE_DTT_SCHEMA,
      },
      [
        {
          uuid: "4fbb78ab-4a5a-459b-ab0c-ce146e7f6ceb",
          email: "l.y.z.jerron@gmail.com",
          status: "ACTIVE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "3b7bf1f2-d625-40b9-877f-57f08a6dbb56",
          email: "testDummy@shenxj08outlook.onmicrosoft.com",
          status: "ACTIVE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "2ef79861-a67d-40ff-a520-c8d22e7f2390",
          email: "shenxj08@gmail.com",
          status: "ACTIVE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          uuid: "7e7970f2-6aa1-4366-99ef-e5f94610fc2f",
          email: "testDummy2@shenxj08outlook.onmicrosoft.com",
          status: "ACTIVE",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(
      {
        tableName: "users",
        schema: process.env.RSDE_DTT_SCHEMA,
      },
      null,
      {}
    );
  },
};
