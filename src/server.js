// src/server.js
import { createApp } from "./app.js";

const PORT = Number(process.env.PORT || 3000);

createApp()
    .then((app) => {
        app.listen(PORT, () => {
            console.log(`API lista   → http://localhost:${PORT}`);
            console.log(`Swagger UI  → http://localhost:${PORT}/docs`);
        });
    })
    .catch((err) => {
        console.error("Error al iniciar:", err);
        process.exit(1);
    });

