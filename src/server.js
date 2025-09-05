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


    const dishRepo = makeDishRepositorySequelize({ models });

    // Application (CQRS)
    const createDish = makeCreateDish({ dishRepo });
    const updateDish = makeUpdateDish({ dishRepo });
    const listDishes = makeListDishes({ dishRepo });

    // Presentation
    const dishController = makeDishController({ createDish, updateDish, listDishes });
    const dishRoutes = makeDishRoutes(dishController);

    // const __filename = fileURLToPath(import.meta.url);
    // const __dirname = path.dirname(__filename);
    // const openapiPath = path.join(__dirname, "openapi", "restaurant.yaml");
    // const openapiDoc = YAML.parse(fs.readFileSync(openapiPath, "utf8"));

    // Respeta tu OpenAPI: /api/v1/Dish
    app.use("/api/v1/Dish", dishRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(` API running on http://localhost:${PORT}`));
}
main();
