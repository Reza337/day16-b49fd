"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("projects", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			start_date: {
				allowNull: false,
				type: Sequelize.DATEONLY,
			},
			end_date: {
				allowNull: false,
				type: Sequelize.DATEONLY,
			},
			description: {
				type: Sequelize.TEXT,
			},
			technologies: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			image: {
				type: Sequelize.STRING,
			},
			// createdAt: {
			//   allowNull: false,
			//   type: Sequelize.DATE
			// },
			// updatedAt: {
			//   allowNull: false,
			//   type: Sequelize.DATE
			// }
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("projects");
	},
};
