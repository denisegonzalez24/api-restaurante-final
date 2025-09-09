// src/app.js
import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { fileURLToPath } from "node:url";

import { syncDb } from "./infrastructure/db/sequelize.js";
import { buildContainer } from "./container/index.js";
import { errorHandler } from "./presentation/middleware/handler_error.js";

// __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp() {
    await syncDb({ alter: true }); // si querés, controlalo por env

    const app = express();
    app.use(express.json());

    const PORT = Number(process.env.PORT || 3000);

    // --- Swagger UI ---
    let swaggerDoc;
    try {
        // Si seteás OPENAPI_FILE, lo uso; si no, por defecto: src/openapi/restaurant.yaml
        const openapiPath = process.env.OPENAPI_FILE
            ? (path.isAbsolute(process.env.OPENAPI_FILE)
                ? process.env.OPENAPI_FILE
                : path.resolve(process.cwd(), process.env.OPENAPI_FILE))
            : path.resolve(__dirname, "openapi", "restaurant.yaml");

        const raw = fs.readFileSync(openapiPath, "utf8");
        swaggerDoc = yaml.load(raw);

        // Aseguro servers para “Try it out”
        if (!swaggerDoc.servers || swaggerDoc.servers.length === 0) {
            swaggerDoc.servers = [{ url: `http://localhost:${PORT}` }];
        }
        console.log(`[Swagger] Cargado: ${openapiPath}`);
    } catch (err) {
        console.warn("[Swagger] No se pudo cargar el OpenAPI:", err?.message);
        // Fallback mínimo para que /docs siempre levante
        swaggerDoc = {
            openapi: "3.0.1",
            info: { title: "Restaurant API", version: "1.0" },
            servers: [{ url: `http://localhost:${PORT}` }],
            paths: {},
        };
    }

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
    app.get("/docs.json", (_, res) => res.json(swaggerDoc));

    // --- Rutas de la app ---
    const { routers } = buildContainer();
    app.use("/api/v1/Dish", routers.dish);

    // --- Error handler ---
    app.use(errorHandler);

    return app;
}
