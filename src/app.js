// src/app.js (fragmento)
import express from "express";
import { buildContainer } from "./container/index.js";
import { errorHandler } from "./presentation/middleware/handler_error.js";
import path from "path";
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from "url";
import fs from "fs";
import yaml from "js-yaml";

export async function createApp() {
    const app = express();
    app.use(express.json());

    const { routers } = await buildContainer();

    app.use("/api/v1/Dish", routers.dish);

    app.use("/api/v1", routers.catalog);

    app.use("/api/v1/Order", routers.order);

    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    app.use(errorHandler);
    return app;
}