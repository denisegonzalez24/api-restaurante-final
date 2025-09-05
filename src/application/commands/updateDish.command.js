import { assertDishRepo } from "../../domain/ports/dishRepo.port.js";
import Status from "../../shared/status.js";


export function makeUpdateDish({ dishRepo }) {
    const repo = assertDishRepo(dishRepo);

    return async function updateDish(id, patch) {
        if (patch?.price != null && (isNaN(Number(patch.price)) || Number(patch.price) <= 0)) {
            throw new CustomException({ message: "El precio debe ser mayor a cero", status: Status.badRequest });
        }
        const updated = await repo.update(id, patch);
        if (!updated) throw new CustomException({ message: "Plato no encontrado", status: Status.notFound });
        return updated;
    };
}
