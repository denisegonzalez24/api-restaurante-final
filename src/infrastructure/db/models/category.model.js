import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("Category", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(25), allowNull: false },
        description: { type: DataTypes.STRING(255), allowNull: true },
        order: { type: DataTypes.INTEGER, allowNull: true },
    }, { tableName: "Categories", timestamps: false, freezeTableName: true });
