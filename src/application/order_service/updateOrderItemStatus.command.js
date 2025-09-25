import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeUpdateOrderItemStatus({ orderCommandRepo, orderQueryRepo }) {
    return async function updateOrderItemStatus(orderId, itemId, status) {

        const order = await orderQueryRepo.findById(orderId);
        if (!order) throw new ApiError({ message: "Orden no encontrada", status: Status.notFound });

        const item = order.items?.find(i => String(i.id) === String(itemId));
        if (!item) throw new ApiError({ message: "Item no encontrado", status: Status.notFound });

        const closed = await statusQueryRepo.getClosedStatusIds();
        if (closed.has(Number(order.overallStatusId))) {
            throw new ApiError({ message: "La orden está cerrada; no se pueden agregar ni editar ítems", status: Status.badRequest });
        }

        const result = await orderCommandRepo.updateItemStatus(itemId, status);
        const updated = await orderQueryRepo.findById(result.orderId ?? orderId);
        return updated;
    };
}

