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

        const current = await dishQueryRepo2.findById(id);
        if (!current) throw new ApiError({ message: "Plato no encontrado", status: Status.notFound });

        if (patch?.price != null && (isNaN(Number(patch.price)) || Number(patch.price) <= 0)) {
            throw new ApiError({ message: "El precio debe ser mayor a cero", status: Status.badRequest });
        }

        const categoryExists = await categoryQueryRepo2.findById(patch.categoryId);
        if (!categoryExists) throw new ApiError({ message: "La categoría no existe", status: Status.badRequest });

        if (patch?.name && patch.name.trim() !== current.name) {
            const other = await dishQueryRepo2.findByName(patch.name.trim());
            if (other && other.id !== id) {
                throw new ApiError({ message: "Ya existe un plato con ese nombre", status: Status.conflict });
            }
        }

        const updated = await repo.update(id, patch);

        return { dish: updated, category: categoryExists };
    };
}
