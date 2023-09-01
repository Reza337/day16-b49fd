"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// return await queryInterface.bulkInsert(
		// 	"projects",
		// 	[
		// 		{
		// 			name: "Dumbways Mobile App - 2021",
		// 			description:
		// 				"App that used for dumbways student, it was deployed and can downloaded on playstore. Happy download",
		// 			image: "project.jpeg",
		// 			start_date: "2023-08-01",
		// 			end_date: "2023-09-01",
		// 			technologies: ["nodejs", "reactjs", "nextjs", "typescript"],
		// 		},
		// 	],
		// 	{}
		// );
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
