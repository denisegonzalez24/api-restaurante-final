import { models } from "../infrastructure/db/sequelize.js";

// Catalog
import { categoryQueryRepository } from "../infrastructure/query/category.query.js";
import { deliveryTypeQueryRepository } from "../infrastructure/query/deliveryType.query.js";
import { statusQueryRepository } from "../infrastructure/query/status.query.js";

// Orders
import { orderQueryRepository } from "../infrastructure/query/order.query.js";
import { orderCommandRepository } from "../infrastructure/command/order.command.js";

// Controllers + Routes
import { makeCatalogController } from "../presentation/controllers/catalog.controller.js";
import { makeOrderController } from "../presentation/controllers/order.controller.js";
import { makeCatalogRoutes } from "../presentation/routes/catalog.routes.js";
import { makeOrderRoutes } from "../presentation/routes/order.routes.js";
import { makeDishController } from "../presentation/controllers/dish.controller.js";

export function buildContainer() {
    // Repos de catálogo
    const categoryQueryRepo = categoryQueryRepository({ models });
    const deliveryTypeQueryRepo = deliveryTypeQueryRepository({ models });
    const statusQueryRepo = statusQueryRepository({ models });

    // Repos de orden
    const orderQueryRepo = orderQueryRepository({ models });
    // inyecto models también en orderQueryRepo para controller (usa OrderItem)
    orderQueryRepo.models = models;
    const orderCommandRepo = orderCommandRepository({ models });

    //funciones
    const createDish =

    // Controllers
    const dishController = makeDishController({ createDish, updateDish, listDishes });
    const catalogController = makeCatalogController({ categoryQueryRepo, deliveryTypeQueryRepo, statusQueryRepo });
    const orderController = makeOrderController({ orderQueryRepo, orderCommandRepo });

    // Routers
    const dishRouter = makeDishRoutes(dishController);
    const catalogRouter = makeCatalogRoutes(catalogController);
    const orderRouter = makeOrderRoutes(orderController);


    return {
        routers: {
            dish: dishRouter,
            catalog: catalogRouter,
            order: orderRouter,
        },
    };
}
