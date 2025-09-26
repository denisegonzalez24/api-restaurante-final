import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeCreateOrder({ orderCommandRepo, orderQueryRepo, dishQueryRepo }) {
    return async function createOrder(body = {}) {
        if (!Array.isArray(body.items) || body.items.length === 0) {
            throw new ApiError({ message: "Debe especificar al menos un item", status: Status.badRequest });
        }
        if (!body.deliveryTypeId) {
            throw new ApiError({ message: "Debe especificar un tipo de entrega válido", status: Status.badRequest });
        }

        for (const it of body.items) {
            if (!it?.dishId) {
                throw new ApiError({ message: "Falta 'dishId' en un ítem", status: Status.badRequest });
            }
            const qty = Number(it.quantity);
            if (!Number.isInteger(qty) || qty <= 0) {
                throw new ApiError({ message: "La cantidad debe ser un entero mayor a 0", status: Status.badRequest });
            }
        }
        for (const it of body.items) {
            const dish = await dishQueryRepo.findById(it.dishId);
            if (!dish || dish.isActive === false) {
                throw new ApiError({
                    message: "El plato especificado no existe o no está disponible",
                    status: Status.badRequest,
                });
            }
        }

        const out = await orderCommandRepo.create(body);
        const full = await orderQueryRepo.findById(out.id);
        return full;
    };
}
function withStatus(err, status) { err.status = status; return err; }

