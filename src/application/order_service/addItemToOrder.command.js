// Agrega un plato y devuelve la orden recalculada (201)
export function makeAddItemToOrder({ orderCommandRepo, orderQueryRepo }) {
    return async function addItemToOrder(orderId, { dishId, quantity, notes }) {
        if (!dishId) throw withStatus(new Error("dishId es obligatorio"), 400);
        const q = Number(quantity ?? 1);
        if (!Number.isInteger(q) || q <= 0) throw withStatus(new Error("quantity inválida"), 400);

        await orderCommandRepo.addItem(orderId, { dishId, quantity: q, notes });
        return orderQueryRepo.findById(orderId);
    };
}
function withStatus(err, status) { err.status = status; return err; }
