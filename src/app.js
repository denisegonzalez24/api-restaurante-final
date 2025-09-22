// src/app.js (fragmento)
import express from "express";
import { buildContainer } from "./container/index.js";
import { errorHandler } from "./presentation/middleware/handler_error.js";

export async function createApp() {
    const app = express();
    app.use(express.json());

    const { routers } = await buildContainer();

    app.use("/api/v1/Dish", routers.dish);

    app.use("/api/v1", routers.catalog);

    app.use("/api/v1/Order", routers.order);

    swaggerDoc = yaml.load(raw);

    // Aseguro servers para “Try it out”
    if (!swaggerDoc.servers || swaggerDoc.servers.length === 0) {
        swaggerDoc.servers = [{ url: `http://localhost:${PORT}` }];
    }


    app.use(errorHandler);
    return app;
}
