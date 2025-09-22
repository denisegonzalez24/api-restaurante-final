// src/infrastructure/db/sequelize.js
import { Sequelize } from "sequelize";
import "dotenv/config";
import { initModels } from "./models/index.js";



const DIALECT = (process.env.DB_DIALECT || "postgres").toLowerCase();

export const sequelize =
    DIALECT === "sqlite"
        ? new Sequelize({
            dialect: "sqlite",
            storage: process.env.SQLITE_PATH || "src/infrastructure/db/seeders/data.sqlite",
            logging: false,
        })
        : new Sequelize({
            dialect: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT || 5432),
            database: process.env.DB_NAME || "restaurant",
            username: process.env.DB_USER || "postgres",
            password: process.env.DB_PASS || "123456",
            logging: (process.env.DB_LOGGING || "false") === "true" ? console.log : false,
        });

export const models = initModels(sequelize);

export async function syncDb({ force = false, alter = false } = {}) {
    await sequelize.authenticate();
    await sequelize.sync({ force, alter });
}

