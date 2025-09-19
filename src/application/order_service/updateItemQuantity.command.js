export function makeUpdateItemQuantity({ orderCommandRepo, orderQueryRepo }) {
    return async function updateItemQuantity(orderItemId, quantity) {
        const q = Number(quantity);
        if (!Number.isInteger(q) || q <= 0) {
            const err = new Error("quantity inválida"); err.status = 400; throw err;
        }
        const result = await orderCommandRepo.updateItemQuantity(orderItemId, q);
        const orderId = result?.orderId ?? result?.order_id ?? result?.order?.id;

        if (!orderId) {
            // Fallback: si tu command no devuelve orderId, lo obtenemos por query
            const itemModel = orderQueryRepo?.models?.OrderItem;
            if (!itemModel) { const e = new Error("No se pudo determinar la orden del ítem"); e.status = 500; throw e; }
            const row = await itemModel.findByPk(orderItemId);
            if (!row) { const e = new Error("Item no encontrado"); e.status = 404; throw e; }
            return orderQueryRepo.findById(row.orderId);
        }
        return orderQueryRepo.findById(orderId);
    };
}