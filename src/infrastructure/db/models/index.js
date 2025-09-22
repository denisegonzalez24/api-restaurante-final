// src/infrastructure/db/models/index.js
import { logPurple } from "../../../shared/log_custom.js";
import categoryModel from "./category.model.js";
import deliveryTypeModel from "./deliveryType.model.js";
import dishModel from "./dish.model.js";
import orderModel from "./order.model.js";
import orderItemModel from "./orderItem.model.js";
import statusModel from "./status.model.js";

export function initModels(sequelize) {
    const Category = categoryModel(sequelize);
    const DeliveryType = deliveryTypeModel(sequelize);
    const Status = statusModel(sequelize);
    const Dish = dishModel(sequelize);
    const Order = orderModel(sequelize);
    const OrderItem = orderItemModel(sequelize);

    logPurple("inicio models");

    Category.hasMany(Dish, { foreignKey: "categoryId", as: "dishes" });
    Dish.belongsTo(Category, { foreignKey: "categoryId", as: "category", targetKey: "id", onDelete: "RESTRICT", onUpdate: "CASCADE" });

    DeliveryType.hasMany(Order, { foreignKey: "deliveryTypeId", as: "orders" });
    Order.belongsTo(DeliveryType, { foreignKey: "deliveryTypeId", as: "deliveryType", targetKey: "id", onDelete: "SET NULL", onUpdate: "CASCADE" });

    Status.hasMany(Order, { foreignKey: "overallStatusId", as: "orders" });
    Order.belongsTo(Status, { foreignKey: "overallStatusId", as: "overallStatus", targetKey: "id", onDelete: "SET NULL", onUpdate: "CASCADE" });

    Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
    OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order", targetKey: "id", onDelete: "CASCADE", onUpdate: "CASCADE" });

    Dish.hasMany(OrderItem, { foreignKey: "dishId", as: "items" });
    OrderItem.belongsTo(Dish, { foreignKey: "dishId", as: "dish", targetKey: "id", onDelete: "RESTRICT", onUpdate: "CASCADE" });

    Status.hasMany(OrderItem, { foreignKey: "statusId", as: "orderItems" });
    OrderItem.belongsTo(Status, { foreignKey: "statusId", as: "status", targetKey: "id", onDelete: "SET NULL", onUpdate: "CASCADE" });


    const models = { Category, DeliveryType, Status, Dish, Order, OrderItem };

    //  console.log("[ORM] Models:", Object.keys(models));
    //  console.log("[ORM] Category table:", Category.tableName);
    //  console.log("[ORM] Category attrs:", Object.keys(Category.rawAttributes));

    return models;
}
