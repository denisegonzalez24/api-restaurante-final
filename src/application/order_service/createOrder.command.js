// Crea una orden y retorna el DETALLE completo (para responder 201)
export function makeCreateOrder({ orderCommandRepo, orderQueryRepo }) {
    return async function createOrder(body = {}) {
        // Validaciones mínimas (el resto se refuerza en el repo)
        const items = Array.isArray(body.items) ? body.items : [];
        for (const it of items) {
            if (!it?.dishId) throw withStatus(new Error("Falta dishId en un ítem"), 400);
            const q = Number(it.quantity ?? 1);
            if (!Number.isInteger(q) || q <= 0) throw withStatus(new Error("quantity inválida"), 400);
        }

        const out = await orderCommandRepo.create(body);     // crea + calcula total + estado Pending
        const full = await orderQueryRepo.findById(out.id);  // detalle completo para la respuesta
        return full;
    };
}
function withStatus(err, status) { err.status = status; return err; }
