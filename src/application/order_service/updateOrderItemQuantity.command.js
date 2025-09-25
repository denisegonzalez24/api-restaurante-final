import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeUpdateOrderItemQuantity({ orderQueryRepo, orderCommandRepo, statusQueryRepo }) {
    return async function updateOrderItemQuantity(orderId, itemId, quantity) {

        const quantityInsert = Number(quantity);
        if (!Number.isInteger(quantityInsert) || quantityInsert <= 0) { throw new ApiError({ message: "quantity inválida", status: Status.badRequest }); }

        const order = await orderQueryRepo.findById(orderId);
        if (!order) { throw new ApiError({ message: "Orden no encontrada", status: Status.notFound }); }

        const closed = await statusQueryRepo.getClosedStatusIds();
        if (closed.has(Number(order.overallStatusId))) { throw new ApiError({ message: "La orden está cerrada; no se pueden agregar ni editar ítems", status: Status.badRequest }); }

        const item = order.items?.find(i => String(i.id) === String(itemId));
        if (!item) throw new ApiError({ message: "Item no encontrado", status: Status.notFound });

        if (item.status?.name !== "Pending") { throw new ApiError({ message: "No se puede modificar un item en preparación o servido", status: Status.badRequest }); }

        const result = await orderCommandRepo.updateItemQuantity(itemId, quantityInsert);
        const updated = await orderQueryRepo.findById(result.orderId ?? orderId);
        return updated;

    };
}
