import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("OrderItem", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        notes: { type: DataTypes.TEXT, allowNull: true },
        createDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        orderId: { type: DataTypes.BIGINT, allowNull: false },
        dishId: { type: DataTypes.UUID, allowNull: false },
        statusId: { type: DataTypes.INTEGER, allowNull: true },
    }, { tableName: "OrderItems", timestamps: false, freezeTableName: true });
