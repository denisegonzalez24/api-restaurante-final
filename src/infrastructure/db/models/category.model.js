import { DataTypes } from "sequelize";


export default (sequelize) =>
    sequelize.define("Category", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(25), allowNull: false, field: "Name" },
        description: { type: DataTypes.STRING(255), allowNull: true, field: "Description" },
        order: { type: DataTypes.INTEGER, allowNull: true, field: "Order" }
    }, { tableName: "Category", timestamps: false, freezeTableName: true });
