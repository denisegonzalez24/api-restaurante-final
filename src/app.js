// src/app.js (fragmento)
import express from "express";
import { buildContainer } from "./build.router.js";
import { errorHandler } from "./presentation/middleware/handler_error.js";
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from "url";
import fs from "fs";
import yaml from "js-yaml";
import cors from "cors";


export async function createApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const { routers } = await buildContainer();

    app.use("/api/v1/Dish", routers.dish);

    app.use("/api/v1", routers.catalog);

    app.use("/api/v1/Order", routers.order);

    const openapiUrl = new URL("openapi/restaurant.yaml", import.meta.url);
    const openapiPath = fileURLToPath(openapiUrl);
    const raw = fs.readFileSync(openapiPath, "utf8");
    const swaggerDoc = yaml.load(raw);
    console.log(`[Swagger] Cargado: ${openapiPath} `);
    console.log("OpenAPI version:", swaggerDoc.openapi || swaggerDoc.swagger);
    console.log("Paths count:", Object.keys(swaggerDoc?.paths ?? {}).length);
    console.log("Some paths:", Object.keys(swaggerDoc?.paths ?? {}).slice(0, 5));

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));

    app.use(errorHandler);
    return app;
}

