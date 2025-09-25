import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function makeDeleteDish({ dishQueryRepo, dishCommandRepo, orderQueryRepo }) {
    return async function deleteDish(id) {

        const dish = await dishQueryRepo.findById(id);
        if (!dish) throw new ApiError({ message: "Plato no encontrado", status: Status.notFound });

        const referenced = await orderQueryRepo.hasOrderItemsForDish(id);
        if (referenced) { throw new ApiError({ message: "No se puede eliminar el plato porque está incluido en órdenes activas", status: Status.conflict }); }

        const deleted = await dishCommandRepo.deleteById(id);
        if (deleted === 0) { throw new ApiError({ message: "Plato no encontrado", status: Status.notFound }); }
        return deleted;
    };
}
