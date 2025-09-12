// src/server.js
import { createApp } from "./app.js";
import { logPurple } from "./shared/log_custom.js";

const PORT = Number(process.env.PORT || 3000);

createApp()
    .then((app) => {
        app.listen(PORT, () => {
            logPurple(`API lista   → http://localhost:${PORT}`);
            logPurple(`Swagger UI  → http://localhost:${PORT}/docs`);
        });
    })
    .catch((err) => {
        console.error("Error al iniciar:", err);
        process.exit(1);
    });

