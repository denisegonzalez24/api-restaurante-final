// src/infrastructure/db/sequelize.js
import { Sequelize, DataTypes, Op } from "sequelize";
import 'dotenv/config';

const {
    DB_DIALECT = "postgres",
    DB_HOST = "localhost",
    DB_PORT = 5432,
    DB_NAME = "restaurant",
    DB_USER = "postgres",
    DB_PASS = 123456,
    DB_SSL = "false",
    DB_LOGGING = "false"
} = process.env;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: DB_DIALECT,          // "postgres"
    logging: DB_LOGGING === "true" ? console.log : false,
    dialectOptions: DB_SSL === "true" ? {
        ssl: { require: true, rejectUnauthorized: false }
    } : {}
});

// MODELOS (podés dejar como los tenías)
export const Category = sequelize.define("Category", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER }
}, { tableName: "categories", timestamps: false });

export const Dish = sequelize.define("Dish", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }, // Postgres lo maneja perfecto
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    imageUrl: { type: DataTypes.STRING },
    createDate: { type: DataTypes.DATE, defaultValue: Sequelize.fn("now") },
    updateDate: { type: DataTypes.DATE, defaultValue: Sequelize.fn("now") }
}, { tableName: "dishes", timestamps: false });

Dish.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Dish, { foreignKey: "categoryId" });

export async function initDb() {
    await sequelize.authenticate();
    // Code-first: crea/actualiza (para producción, preferí migraciones)
    await sequelize.sync(); // { alter: true } si necesitás ajustar columnas
}

export const models = { Category, Dish, Op };
