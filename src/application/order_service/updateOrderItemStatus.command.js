/**
 * Actualiza el estado de un ítem y devuelve la ORDEN actualizada.
 * Requiere saber el orderId del ítem; hay dos estrategias:
 *  A) Hacer que orderCommandRepo.updateItemStatus retorne { orderId }
 *  B) Buscar el item para obtener orderId y luego consultar la orden
 *
 * Implemento la A y, si tu repo actual no retorna, hago fallback a B.
 */
export function makeUpdateOrderItemStatus({ orderCommandRepo, orderQueryRepo }) {
    return async function updateOrderItemStatus(orderItemId, status) {
        const result = await orderCommandRepo.updateItemStatus(orderItemId, status);
        let orderId = result?.orderId;

        // Fallback si el command no devuelve orderId (usa models expuestos por tu orderQueryRepo)
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
