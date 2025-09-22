import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("OrderItem", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, field: "OrderItemId" },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, field: "Quantity" },
        notes: { type: DataTypes.TEXT, allowNull: true, field: "Notes" },
        createDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "CreateDate" },
        orderId: { type: DataTypes.BIGINT, allowNull: false, field: "Order" },
        dishId: { type: DataTypes.UUID, allowNull: false, field: "Dish" },
        statusId: { type: DataTypes.INTEGER, allowNull: true, field: "Status" },
    }, { tableName: "OrderItem", timestamps: false, freezeTableName: true });
