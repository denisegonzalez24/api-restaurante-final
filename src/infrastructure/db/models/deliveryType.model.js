import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("DeliveryType", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING(25), allowNull: false, field: "Name" },
    }, { tableName: "DeliveryType", timestamps: false, freezeTableName: true });
