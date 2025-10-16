import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("Status", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(), allowNull: false, field: "Name" },
    }, { tableName: "Status", timestamps: false, freezeTableName: true });
