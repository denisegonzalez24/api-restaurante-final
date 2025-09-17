import { makeCreateDish } from "../application/dish_service/createDish.command.js";
import { makeListDishes } from "../application/dish_service/listDishes.query.js";
import { makeUpdateDish } from "../application/dish_service/updateDish.command.js";
import { dishCommandRepository } from "../infrastructure/command/dish.command.js";
import { orderCommandRepository } from "../infrastructure/command/order.command.js";
import { categoryQueryRepository } from "../infrastructure/query/category.query.js";
import { deliveryTypeQueryRepository } from "../infrastructure/query/deliveryType.query.js";
import { dishQueryRepository } from "../infrastructure/query/dish.query.js";
import { orderQueryRepository } from "../infrastructure/query/order.query.js";
import { statusQueryRepository } from "../infrastructure/query/status.query.js";
import { makeDishController } from "../presentation/controllers/dish.controller.js";
import { makeCatalogRoutes } from "../presentation/routes/catalog.routes.js";
import { makeDishRoutes } from "../presentation/routes/dish.routes.js";
import { makeOrderRoutes } from "../presentation/routes/order.routes.js";
import { models, syncDb } from "../infrastructure/db/sequelize.js";
import { makeCatalogController } from "../presentation/controllers/catalog.controller.js";

export async function buildContainer() {


    await syncDb({ alter: true });
    // Repos 
    const dishQueryRepo = dishQueryRepository({ models });
    const dishCommandRepo = dishCommandRepository({ models });

    const categoryQueryRepo = categoryQueryRepository({ models });
    // const categoryCommandRepo = categoryCommandRepository({ models });

    const orderQueryRepo = orderQueryRepository({ models });
    const orderCommandRepo = orderCommandRepository({ models });

    const deliveryTypeQueryRepo = deliveryTypeQueryRepository({ models });
    //   const deliveryTypeCommandRepo = deliveryTypeCommandRepository({ models });

    const statusQueryRepo = statusQueryRepository({ models });
    //   const statusCommandRepo = statusCommandRepository({ models });

    //funciones dish
    const createDish = makeCreateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const updateDish = makeUpdateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const listDishes = makeListDishes({ dishQueryRepo });

    //funciones category export const makeUpdateCategory = ({ categoryRepoQuery, categoryRepoCommand }) => async (id, dto) => {
    const createCategory = makeCreateCategory()
    const updateCategory = makeUpdateCategory({})
    const deleteCategory = makeDeleteCategory()
    const listCategories = makeListCategories()
    const getCategoryById = makeGetCategoryById()

    //funciones order
    categoryQueryRepo, deliveryTypeQueryRepo, statusQueryRepo

    //

    //controller 
    const dishController = makeDishController({ createDish, updateDish, listDishes });
    const catalogController = makeCatalogController({ categoryQueryRepo, deliveryTypeQueryRepo, statusQueryRepo });

    // Routers
    const dishRouter = makeDishRoutes(dishController);
    const catalogRouter = makeCatalogRoutes(catalogController);
    const orderRouter = makeOrderRoutes(orderController);
    // const categoryRouter = makeCategoryRoutes(categoryController);


    return {
        routers: {
            dish: dishRouter,
            catalog: catalogRouter,
            order: orderRouter,
        },
    };
}
