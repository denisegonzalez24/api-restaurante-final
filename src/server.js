import express from "express";
import "dotenv/config";

import { initDb, models } from "./infrastructure/db/sequelize.js";
import { makeDishRepositorySequelize } from "./infrastructure/repositories/dish.repository.sequelize.js";

import { makeCreateDish } from "./application/commands/createDish.command.js";
import { makeUpdateDish } from "./application/commands/updateDish.command.js";
import { makeListDishes } from "./application/queries/listDishes.query.js";

import { makeDishController } from "./presentation/controllers/dish.controller.js";
import { makeDishRoutes } from "./presentation/routes/dish.routes.js";


async function main() {
    await initDb();

    const app = express();
    app.use(express.json());

    // Infra concreta
    const dishRepo = makeDishRepositorySequelize({ models });

    // Application (CQRS)
    const createDish = makeCreateDish({ dishRepo });
    const updateDish = makeUpdateDish({ dishRepo });
    const listDishes = makeListDishes({ dishRepo });

    // Presentation
    const dishController = makeDishController({ createDish, updateDish, listDishes });
    const dishRoutes = makeDishRoutes(dishController);

    // Respeta tu OpenAPI: /api/v1/Dish
    app.use("/api/v1/Dish", dishRoutes);

    // app.use(notFoundHandler);
    // app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
}
main();
