
import { assertDishRepoQuery } from "../../domain/ports/dishRepoQuery.port.js";
import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";



export function makeListDishes({ dishQueryRepo }) {
    const repo = assertDishRepoQuery(dishQueryRepo);

    return async function listDishes(params = {}) {
        if (params?.priceOrder) {
            const up = String(params.priceOrder).toUpperCase();
            if (!["ASC", "DESC"].includes(up)) {
                throw new ApiError({ message: "Parámetros de ordenamiento inválidos", status: Status.badRequest });
            }
            params.priceOrder = up;
        }
        return repo.findAll(params || {});
    };
}
