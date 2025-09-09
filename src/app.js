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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp() {
    await syncDb({ alter: true });

    const app = express();
    app.use(express.json());

    const PORT = Number(process.env.PORT || 3000);

    // -------- Swagger UI --------
    let swaggerDoc;
    try {
        const openapiPath = process.env.OPENAPI_FILE
            ? (path.isAbsolute(process.env.OPENAPI_FILE)
                ? process.env.OPENAPI_FILE
                : path.resolve(process.cwd(), process.env.OPENAPI_FILE))
            : path.resolve(__dirname, "openapi", "restaurant.yaml");

        const raw = fs.readFileSync(openapiPath, "utf8");
        swaggerDoc = yaml.load(raw);
        if (!swaggerDoc.servers || swaggerDoc.servers.length === 0) {
            swaggerDoc.servers = [{ url: `http://localhost:${PORT}` }];
        }
        console.log(`[Swagger] Cargado: ${openapiPath}`);
    } catch (err) {
        console.warn("[Swagger] No se pudo cargar el OpenAPI:", err?.message);
        swaggerDoc = {
            openapi: "3.0.1",
            info: { title: "Restaurant API", version: "1.0" },
            servers: [{ url: `http://localhost:${PORT}` }],
            paths: {},
        };
    }
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
    app.get("/docs.json", (_, res) => res.json(swaggerDoc));
    // Si querés, que la raíz redirija a swagger
    // app.get("/", (_, res) => res.redirect("/docs"));

    // -------- Rutas --------
    const { routers } = buildContainer();

    // Monta solo si es un Router válido
    function mountIfRouter(pathname, router, name) {
        const ok = router && typeof router === "function" && router.stack;
        if (ok) {
            app.use(pathname, router);
            console.log(`[Routes] OK ${name} → ${pathname}`);
        } else {
            console.warn(`[Routes] SKIP ${name}: no es un Router (recibido: ${typeof router})`);
        }
    }

    // Ajustá estos según lo que tengas disponible en tu container:
    mountIfRouter("/api/v1/Dish", routers?.dish, "dish");
    mountIfRouter("/api/v1", routers?.catalog, "catalog");
    mountIfRouter("/api/v1/Order", routers?.order, "order");

    // -------- Error handler --------
    app.use(errorHandler);

    return app;
}
