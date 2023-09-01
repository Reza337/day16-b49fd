"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Day14s", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			author: {
				type: Sequelize.INTEGER,
				references: {
					model: "users",
					key: "id",
				},
			},
			start_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			end_date: {
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			// technologies: {
			// 	type: Sequelize.ARRAY(Sequelize.STRING),
			// 	allowNull: false,
			// 	defaultValue: [],
			// },
			nodejs: {
				type: Sequelize.BOOLEAN,
			},
			reactjs: {
				type: Sequelize.BOOLEAN,
			},
			nextjs: {
				type: Sequelize.BOOLEAN,
			},
			typescript: {
				type: Sequelize.BOOLEAN,
			},
			image: {
				type: Sequelize.STRING,
			},
			// createdAt: {
			// 	allowNull: false,
			// 	type: Sequelize.DATE,
			// },
			// updatedAt: {
			// 	allowNull: false,
			// 	type: Sequelize.DATE,
			// },
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Day14s");
	},
};
