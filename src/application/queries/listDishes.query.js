import { assertDishRepo } from "../../domain/ports/dishRepo.port.js";
import Status from "../../shared/status.js";
import CustomException from "../../shared/status.js";


export function makeListDishes({ dishRepo }) {
    const repo = assertDishRepo(dishRepo);

    return async function listDishes(params) {
        if (params?.priceOrder) {
            const up = String(params.priceOrder).toUpperCase();
            if (!["ASC", "DESC"].includes(up)) {
                throw new CustomException({ message: "Parámetros de ordenamiento inválidos", status: Status.badRequest });
            }
            params.priceOrder = up;
        }
        return repo.findAll(params || {});   // lectura
    };
}
