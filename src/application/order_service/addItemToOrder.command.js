// src/application/order_service/addItemToOrder.command.js
import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeAddItemToOrder({ orderQueryRepo, orderCommandRepo, dishQueryRepo, statusQueryRepo }) {
    return async function addItemToOrder(orderId, { dishId, quantity, notes }) {
        const q = Number(quantity || 1);
        const order = await orderQueryRepo.findById(orderId);
        if (!order) throw new ApiError({ message: "Orden no encontrada", status: Status.notFound });

        const closed = await statusQueryRepo.getClosedStatusIds();
        if (closed.has(Number(order.overallStatusId))) { throw new ApiError({ message: "La orden está cerrada", status: Status.badRequest }); }

        const dish = await dishQueryRepo.findById(dishId);
        if (!dish) throw new ApiError({ message: "Dish no encontrado", status: Status.notFound });
        if (dish.available === false) { throw new ApiError({ message: "Dish inactivo", status: Status.badRequest }); }

        const result = await orderCommandRepo.addItem(orderId, { dishId, q, notes });
        const updated = await orderQueryRepo.findById(result.orderId ?? orderId);
        return updated;
    };
}
