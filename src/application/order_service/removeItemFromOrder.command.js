// Elimina un ítem (204). No devuelve cuerpo.
export function makeRemoveItemFromOrder({ orderCommandRepo }) {
    return async function removeItemFromOrder(orderItemId) {
        await orderCommandRepo.removeItem(orderItemId);
    };
}
