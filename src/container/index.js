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
import { makeOrderRoutes } from "../presentation/routes/order.routes.js";
import { models, syncDb } from "../infrastructure/db/sequelize.js";
import { makeCatalogController } from "../presentation/controllers/catalog.controller.js";
import { makeDeleteCategory } from "../application/category_service/deleteCategory.command.js";
import { makeCreateCategory } from "../application/category_service/createCategory.command.js";
import { makeUpdateCategory } from "../application/category_service/updateCategory.command.js";
import { makeListCategories } from "../application/category_service/listCategories.query.js";
import { makeGetCategoryById } from "../application/category_service/getCategoryById.query.js";
import { makeOrderController } from "../presentation/controllers/order.controller.js";
import categoryCommandRepository from "../infrastructure/command/category.command.js";
import makeListDeliveryTypes from "../application/catalog_service/listDeliveryTypes.query.js";
import makeListStatuses from "../application/catalog_service/listStatuses.query.js";
import { makeCategoryController } from "../presentation/controllers/category.controller.js";
import { makeCreateOrder } from "../application/order_service/createOrder.command.js";
import { makeListOrders } from "../application/order_service/listOrders.query.js";
import { makeGetOrderById } from "../application/order_service/getOrderById.query.js";
import { makeAddItemToOrder } from "../application/order_service/addItemToOrder.command.js";
import { makeRemoveItemFromOrder } from "../application/order_service/removeItemFromOrder.command.js";
import { makeUpdateOrderItemStatus } from "../application/order_service/updateOrderItemStatus.command.js";
import { makeCategoryRoutes } from "../presentation/routes/category.routes.js";
import { makeDishRoutes } from "../presentation/routes/dish.routes.js";

export async function buildContainer() {


    await syncDb({ alter: true });
    // Repos 
    const dishQueryRepo = dishQueryRepository({ models });
    const dishCommandRepo = dishCommandRepository({ models });

    const categoryQueryRepo = categoryQueryRepository({ models });
    const categoryCommandRepo = categoryCommandRepository({ models });

    const orderQueryRepo = orderQueryRepository({ models });
    const orderCommandRepo = orderCommandRepository({ models });

    const deliveryTypeQueryRepo = deliveryTypeQueryRepository({ models });
    const statusQueryRepo = statusQueryRepository({ models });


    //funciones dish
    const createDish = makeCreateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const updateDish = makeUpdateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo });
    const listDishes = makeListDishes({ dishQueryRepo });

    //funciones category
    const createCategory = makeCreateCategory({ categoryQueryRepo, categoryCommandRepo });
    const updateCategory = makeUpdateCategory({ categoryQueryRepo, categoryCommandRepo, dishQueryRepo });
    const deleteCategory = makeDeleteCategory({ categoryQueryRepo, categoryCommandRepo, dishQueryRepo });
    const listCategories = makeListCategories({ categoryQueryRepo });
    const getCategoryById = makeGetCategoryById({ categoryQueryRepo });


    const listDeliveryTypes = makeListDeliveryTypes({ deliveryTypeQueryRepo });
    const listStatuses = makeListStatuses({ statusQueryRepo });

    //funciones order
    const createOrder = makeCreateOrder({ orderCommandRepo, orderQueryRepo });
    const listOrders = makeListOrders({ orderQueryRepo });
    const getOrderById = makeGetOrderById({ orderQueryRepo });
    const addItemToOrder = makeAddItemToOrder({ orderCommandRepo, orderQueryRepo });
    const removeItemFromOrder = makeRemoveItemFromOrder({ orderCommandRepo });
    const updateOrderItemStatus = makeUpdateOrderItemStatus({ orderCommandRepo, orderQueryRepo });


    //controller 
    const dishController = makeDishController({ createDish, updateDish, listDishes });
    const catalogController = makeCatalogController({ listCategories, listDeliveryTypes, listStatuses, });
    const orderController = makeOrderController({ createOrder, listOrders, getOrderById, addItemToOrder, removeItemFromOrder, updateOrderItemStatus });
    const categoryController = makeCategoryController({ listCategories, getCategoryById, createCategory, updateCategory, deleteCategory, });

    // Routers
    const dishRouter = makeDishRoutes(dishController);
    const catalogRouter = makeCatalogRoutes(catalogController);
    const orderRouter = makeOrderRoutes(orderController);
    const categoryRouter = makeCategoryRoutes(categoryController);



    return {
        routers: {
            dish: dishRouter,
            catalog: catalogRouter,
            order: orderRouter,
        },
    };
}
