// src/application/order_service/addItemToOrder.command.js
import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeAddItemToOrder({ orderQueryRepo, orderCommandRepo, dishQueryRepo }) {
    return async function addItemToOrder(orderId, { dishId, quantity, notes }) {
        const order = await orderQueryRepo.findById(orderId);
        if (!order) throw new ApiError({ message: "Orden no encontrada", status: Status.notFound });
        if (order.overallStatus?.name === "Closed") {
            throw new ApiError({ message: "La orden está cerrada", status: Status.badRequest });
        }

        const dish = await dishQueryRepo.findById(dishId);
        if (!dish) throw new ApiError({ message: "Dish no encontrado", status: Status.notFound });
        if (dish.available === false) {
            throw new ApiError({ message: "Dish inactivo", status: Status.badRequest });
        }

        await orderCommandRepo.addItem(orderId, { dishId, quantity, notes });
        return orderQueryRepo.findById(orderId);
    };
}
