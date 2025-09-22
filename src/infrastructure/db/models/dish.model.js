import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("Dish", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, field: "DishId_uuid" },
        name: { type: DataTypes.STRING(255), allowNull: false, field: "Name" },
        description: { type: DataTypes.TEXT, allowNull: true, field: "Description" },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: "Price" },
        available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "Available" },
        imageUrl: { type: DataTypes.TEXT, allowNull: true, field: "ImageUrl" },
        createDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: "CreateDate" },
        updateDate: { type: DataTypes.DATE, allowNull: true, field: "UpdateDate" },
        categoryId: { type: DataTypes.INTEGER, allowNull: false, field: "Category" },
    }, {
        tableName: "Dish",
        timestamps: false,
        freezeTableName: true,

    });
