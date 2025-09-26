
import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";


export function makeUpdateOrderItems({
    orderQueryRepo,
    orderCommandRepo,
    dishQueryRepo,
    statusQueryRepo,
}) {

    function resolveOrderId({ orderId }) {
        if (!orderId) {
            throw new ApiError({
                message: "Se requiere 'orderId' para actualizar la orden",
                status: Status.badRequest,
            });
        }
        return orderId;
    }

    return async function updateOrderItems({ items, orderId, ctx }) {

        if (!Array.isArray(items)) {
            throw new ApiError({
                message: "Formato inválido: 'items' debe ser un array",
                status: Status.badRequest,
            });
        }
        if (items.length === 0) {
            throw new ApiError({
                message: "No hay items para actualizar",
                status: Status.badRequest,
            });
        }

        const theOrderId = resolveOrderId({ orderId, ctx });
        const order = await orderQueryRepo.findById(theOrderId);
        if (!order) {
            throw new ApiError({ message: "Orden no encontrada", status: Status.notFound });
        }


        const closed = await statusQueryRepo.getClosedStatusIds();
        if (closed.has(Number(order.overallStatusId))) {
            throw new ApiError({
                message: "La orden está cerrada; no se pueden agregar ni editar ítems",
                status: Status.badRequest,
            });
        }

        for (const raw of items) {
            const dishId = raw?.id;
            const quantity = Number(raw?.quantity);
            const notes = raw?.notes ?? null;

            if (!dishId || !Number.isFinite(quantity) || quantity < 1) {
                throw new ApiError({
                    message: "Item inválido: 'id' y 'quantity' (>=1) son obligatorios",
                    status: Status.badRequest,
                });
            }


            const dish = await dishQueryRepo.findById(dishId);
            if (!dish || dish?.isActive === false) {
                throw new ApiError({
                    message: "El plato especificado no existe o no está disponible",
                    status: Status.badRequest,
                });
            }


            const existing = order.items?.find(
                (it) => String(it?.dish?.id ?? it?.dishId) === String(dishId)
            );

            if (existing) {

                await orderCommandRepo.updateItemQuantity(existing.id, quantity, notes);
            } else {

                await orderCommandRepo.addItem(order.id, dishId, quantity, notes);
            }
        }


        const reloaded = await orderQueryRepo.findById(order.id);
        if (!reloaded) {

            return order;
        }

        let totalAmount = 0;
        for (const it of reloaded.items ?? []) {

            const unit =
                Number(it?.dish?.price ?? it?.price ?? 0);
            const qty = Number(it?.quantity ?? 0);
            totalAmount += unit * qty;
        }

        await orderCommandRepo.updateTotal(reloaded.id, totalAmount);
        await orderCommandRepo.touchUpdateDate(reloaded.id);


        const updated = await orderQueryRepo.findById(reloaded.id);
        return updated ?? reloaded;
    };
}
