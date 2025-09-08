import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("Order", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        deliveryTo: { type: DataTypes.STRING(25), allowNull: true },
        notes: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
        createDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updateDate: { type: DataTypes.DATE, allowNull: true },
        deliveryTypeId: { type: DataTypes.INTEGER, allowNull: true },
        overallStatusId: { type: DataTypes.INTEGER, allowNull: true },
    }, { tableName: "Orders", timestamps: false, freezeTableName: true });
