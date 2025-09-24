
export function makeUpdateOrderItemStatus({ orderCommandRepo, orderQueryRepo }) {
    return async function updateOrderItemStatus(orderItemId, status) {
        const result = await orderCommandRepo.updateItemStatus(orderItemId, status);
        let orderId = result?.orderId;

        if (!orderId && orderQueryRepo?.models?.OrderItem) {
            const item = await orderQueryRepo.models.OrderItem.findByPk(orderItemId);
            if (!item) throw withStatus(new Error("Item no encontrado"), 404);
            orderId = item.orderId;
        }

        if (!orderId) throw withStatus(new Error("No se pudo determinar la orden del ítem"), 500);
        return orderQueryRepo.findById(orderId);
    };
}
function withStatus(err, status) { err.status = status; return err; }
