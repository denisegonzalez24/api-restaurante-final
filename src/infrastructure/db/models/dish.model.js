import { DataTypes } from "sequelize";

export default (sequelize) =>
    sequelize.define("Dish", {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        imageUrl: { type: DataTypes.TEXT, allowNull: true },

        createDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updateDate: { type: DataTypes.DATE, allowNull: true },

        categoryId: { type: DataTypes.INTEGER, allowNull: false },
    }, {
        tableName: "Dishes",
        timestamps: false,
        freezeTableName: true,

    });
