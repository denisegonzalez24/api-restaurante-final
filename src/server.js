
import express, { json } from 'express';
import models from './infrastructure/db/sequelize.js';
import makeDishesService from './application/services/dishes.service.js';
import makeDishesController from './presentation/controllers/dishes.controller.js';
import makeDishesRoutes from './presentation/routes/dishes.routes.js';
import db from './infrastructure/db/sequelize.js';
import makeDishRepositorySequelize from './infrastructure/repositories/dish.repository.sequelize.js'
import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || ".env" });

async function main() {
    await db.initDb();

    const app = express();
    app.use(json());

    // DI/wiring
    const dishRepo = makeDishRepositorySequelize({ models });
    const dishesService = makeDishesService({ dishRepo });
    const dishesController = makeDishesController({ dishesService });
    const dishesRoutes = makeDishesRoutes(dishesController);

    app.use('/api/dishes', dishesRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
}
main();
