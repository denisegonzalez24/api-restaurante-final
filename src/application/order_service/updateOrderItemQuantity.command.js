import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeUpdateOrderItemQuantity({ orderQueryRepo, orderCommandRepo }) {
    return async function updateOrderItemQuantity(orderId, itemId, quantity) {

        const q = Number(quantity);
        if (!Number.isInteger(q) || q <= 0) {
            throw new ApiError({ message: "quantity inválida", status: Status.badRequest });
        }
        const order = await orderQueryRepo.findById(orderId);
        if (!order) {
            throw new ApiError({ message: "Orden no encontrada", status: Status.notFound });
        }
        if (order.overallStatus?.name === "Closed") {
            throw new ApiError({ message: "La orden está cerrada", status: Status.badRequest });
        }
        const item = order.items?.find(i => String(i.id) === String(itemId));
        if (!item) {
            throw new ApiError({ message: "Item no encontrado", status: Status.notFound });
        }
        if (item.status?.name !== "Pending") {
            throw new ApiError({
                message: "No se puede modificar un item en preparación o servido",
                status: Status.badRequest
            });
        }

        const result = await orderCommandRepo.updateItemQuantity(itemId, q);
        if (!result || !result.orderId) {
            throw new ApiError({ message: "No se pudo actualizar la cantidad", status: Status.internalServerError });
        }
        return orderQueryRepo.findById(orderId);
    };
}
