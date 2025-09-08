import { assertCategoryRepoQuery } from "../../domain/ports/categoryRepoQuery.js";
import { assertDishRepoCommand } from "../../domain/ports/dishRepoCommand.port.js";
import { assertDishRepoQuery } from "../../domain/ports/dishRepoQuery.port.js";
import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";


export function makeUpdateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo }) {
    const repo = assertDishRepoCommand(dishCommandRepo);
    const categoryQueryRepo2 = assertCategoryRepoQuery(categoryQueryRepo);
    const dishQueryRepo2 = assertDishRepoQuery(dishQueryRepo);


    return async function updateDish(id, patch) {

        if (patch?.price != null && (isNaN(Number(patch.price)) || Number(patch.price) <= 0)) {
            throw new ApiError({ message: "El precio debe ser mayor a cero", status: Status.badRequest });
        }

        const categoryExists = await categoryQueryRepo2.findById(patch.categoryId);
        if (!categoryExists) throw new ApiError({ message: "La categoría no existe", status: Status.conflict });

        const exists = await dishQueryRepo2.findByName(patch.name);
        if (exists) throw new ApiError({ message: "Ya existe un plato con ese nombre", status: Status.conflict });

        const updated = await repo.update(id, patch);
        if (!updated) throw new ApiError({ message: "Plato no encontrado", status: Status.notFound });

        return updated;
    };
}
