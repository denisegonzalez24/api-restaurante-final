import { makeDish } from "../../domain/entities/dish.js";
import { assertDishRepoCommand } from "../../domain/ports/dishRepoCommand.port.js";
import { assertDishRepoQuery } from "../../domain/ports/dishRepoQuery.port.js";
import { CustomException } from "../../shared/custom_exception.js";
import Status from "../../shared/status.js";


export function makeCreateDish({ dishCommandRepo, dishQueryRepo }) {
    const commandRepo = assertDishRepoCommand(dishCommandRepo);
    const queryRepo = assertDishRepoQuery(dishQueryRepo);

    return async function createDish(dto) {
        if (!dto?.name) throw new CustomException({ message: "Nombre obligatorio", status: Status.badRequest });
        if (dto?.price == null || Number(dto.price) <= 0) {
            throw new CustomException({ message: "El precio debe ser mayor a cero", status: Status.badRequest });
        }
        if (!dto?.categoryId) {
            throw new CustomException({ message: "La categoría es obligatoria", status: Status.badRequest });
        }

        const exists = await queryRepo.findByName(dto.name);
        if (exists) throw new CustomException({ message: "Ya existe un plato con ese nombre", status: Status.conflict });

        const entity = makeDish(dto);
        return commandRepo.create(entity);
    };
}
