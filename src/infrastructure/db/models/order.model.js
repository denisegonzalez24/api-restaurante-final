import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("Order", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, field: "OrderId" },
        deliveryTo: { type: DataTypes.STRING(25), allowNull: true, field: "DeliveryTo" },
        notes: { type: DataTypes.TEXT, allowNull: true, field: "Notes" },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: "Price" },
        createDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "CreateDate" },
        updateDate: { type: DataTypes.DATE, allowNull: true, field: "UpdateDate" },
        deliveryTypeId: { type: DataTypes.INTEGER, allowNull: true, field: "DeliveryType" },
        overallStatusId: { type: DataTypes.INTEGER, allowNull: true, field: "OverallStatus" },
    }, {
        tableName: "Order", timestamps: false, freezeTableName: true, createdAt: "CreateDate", updatedAt: "UpdateDate",
    });
