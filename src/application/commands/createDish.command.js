import { makeDish } from "../../domain/entities/dish.js";
import { assertDishRepo } from "../../domain/ports/dishRepo.port.js";
import { CustomException } from "../../shared/custom_exception.js";
import Status from "../../shared/status.js";


export function makeCreateDish({ dishRepo }) {
    const repo = assertDishRepo(dishRepo);

    return async function createDish(dto) {
        if (!dto?.name) throw new CustomException({ message: "Nombre obligatorio", status: Status.badRequest });
        if (dto?.price == null || Number(dto.price) <= 0) {
            throw new CustomException({ message: "El precio debe ser mayor a cero", status: Status.badRequest });
        }
        if (!dto?.categoryId) {
            throw new CustomException({ message: "La categoría es obligatoria", status: Status.badRequest });
        }

        const exists = await repo.findByName(dto.name);
        if (exists) throw new CustomException({ message: "Ya existe un plato con ese nombre", status: Status.conflict });

        const entity = makeDish(dto);
        return repo.create(entity);
    };
}
