// arma todas las dependencias y devuelve routers listos para montar
import { models } from "../infrastructure/db/sequelize.js";

import { dishQueryRepository } from "../infrastructure/query/dish.query.js";
import { dishCommandRepository } from "../infrastructure/command/dish.command.js";
import { categoryQueryRepository } from "../infrastructure/query/category.query.js";

import { makeCreateDish } from "../application/dish_service/createDish.command.js";
import { makeUpdateDish } from "../application/dish_service/updateDish.command.js";
import { makeListDishes } from "../application/dish_service/listDishes.query.js";

import { makeDishController } from "../presentation/controllers/dish.controller.js";
import { makeDishRoutes } from "../presentation/routes/dish.routes.js";

export function buildContainer() {

    const dishQueryRepo = dishQueryRepository({ models });
    const dishCommandRepo = dishCommandRepository({ models });
    const categoryQueryRepo = categoryQueryRepository({ models });


    const createDish = makeCreateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const updateDish = makeUpdateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const listDishes = makeListDishes({ dishQueryRepo });


    const dishController = makeDishController({ createDish, updateDish, listDishes });


    const routers = {
        dish: makeDishRoutes(dishController),
    };

    return { routers };
}
