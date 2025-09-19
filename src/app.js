// src/app.js (fragmento)
import express from "express";
import { buildContainer } from "./container/index.js";
import { errorHandler } from "./presentation/middleware/handler_error.js";

export async function createApp() {
    const app = express();
    app.use(express.json());

    const { routers } = await buildContainer();

    // Dish (OpenAPI exacto)
    app.use("/api/v1/Dish", routers.dish);

    // Catálogos (solo lectura)
    app.use("/api/v1", routers.catalog);

    // Order (Entrega 2)
    app.use("/api/v1/Order", routers.order);

    // Health (opcional, para verificar que el server responde)
    app.get("/health", (_req, res) => res.json({ ok: true }));

    app.use(errorHandler);
    return app;
}
