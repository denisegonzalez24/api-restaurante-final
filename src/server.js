// src/server.js
import express from "express";
import "dotenv/config";

import { models, sequelize, syncDb } from "./infrastructure/db/sequelize.js";

import { dishQueryRepository } from "./infrastructure/query/dish.query.js";
import { dishCommandRepository } from "./infrastructure/command/dish.command.js";

import { makeCreateDish } from "./application/dish_service/createDish.command.js";
import { makeUpdateDish } from "./application/dish_service/updateDish.command.js";
import { makeListDishes } from "./application/dish_service/listDishes.query.js";

import { makeDishController } from "./presentation/controllers/dish.controller.js";
import { makeDishRoutes } from "./presentation/routes/dish.routes.js";
import { logCyan, logPurple } from "./shared/log_custom.js";

// Swagger
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "node:url";
import { Model } from "sequelize";
import { initModels } from "./infrastructure/db/models/index.js";
import { errorHandler } from "./presentation/middleware/handler_error.js";
import { categoryQueryRepository } from "./infrastructure/query/category.query.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("[DB]", sequelize.getDialect(), sequelize.config.host, sequelize.config.database);

async function main() {
    // 1) Sync schema
    await syncDb({ alter: true });


    // 2) Inicializar app ANTES de usar app.use(...)
    const app = express();
    app.use(express.json());

    // 3) Swagger UI (/docs)
    try {
        const openapiPath = process.env.OPENAPI_FILE
            ? (path.isAbsolute(process.env.OPENAPI_FILE)
                ? process.env.OPENAPI_FILE
                : path.join(__dirname, process.env.OPENAPI_FILE))
            : path.join(__dirname, "openapi", "restaurant.yaml"); // ajusta si tu archivo está en otra ruta

        const swaggerDoc = yaml.load(fs.readFileSync(openapiPath, "utf8"));
        const PORT = Number(process.env.PORT || 3000);
        if (!swaggerDoc.servers || swaggerDoc.servers.length === 0) {
            swaggerDoc.servers = [{ url: `http://localhost:${PORT}` }];
        }
        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
        logCyan(`Swagger UI listo en http://localhost:${PORT}/docs (OpenAPI: ${openapiPath})`);
    } catch (e) {
        console.warn(" No se pudo cargar el OpenAPI para Swagger UI. Define OPENAPI_FILE o coloca src/openapi/restaurant.yaml");
    }



    const dishQueryRepo = dishQueryRepository({ models });
    const dishCommandRepo = dishCommandRepository({ models });
    const categoryQueryRepo = categoryQueryRepository({ models });

    const createDish = makeCreateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const updateDish = makeUpdateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const listDishes = makeListDishes({ dishQueryRepo });

    const dishController = makeDishController({ createDish, updateDish, listDishes });
    app.use("/api/v1/Dish", makeDishRoutes(dishController));

    // 5) Health y handler de errores
    app.get("/health", (_req, res) => res.json({ ok: true }));
    app.use((err, _req, res, _next) => {
        const status = err?.status ?? err?.httpCode ?? 500;
        const message = err?.message || "Internal Server Error";
        res.status(status).json({ message });
    });
    app.use(errorHandler);

    // 6) Listen
    const PORT = Number(process.env.PORT || 3000);
    app.listen(PORT, () => logPurple(`API escuchando en http://localhost:${PORT}`));
}

main().catch((e) => {
    console.error("Fatal on startup:", e);
    process.exit(1);
});
