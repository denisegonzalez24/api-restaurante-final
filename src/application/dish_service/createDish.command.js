import { makeDish } from "../../domain/entities/dish.js";
import { assertCategoryRepoQuery } from "../../domain/ports/categoryRepoQuery.js";
import { assertDishRepoCommand } from "../../domain/ports/dishRepoCommand.port.js";
import { assertDishRepoQuery } from "../../domain/ports/dishRepoQuery.port.js";
import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";


export function makeCreateDish({ dishCommandRepo, dishQueryRepo, categoryQueryRepo }) {
    const dishCommandRepo2 = assertDishRepoCommand(dishCommandRepo);
    const dishQueryRepo2 = assertDishRepoQuery(dishQueryRepo);
    const categoryQueryRepo2 = assertCategoryRepoQuery(categoryQueryRepo);

    return async function createDish(dto) {
        if (!dto?.name) throw new ApiError({ message: "Nombre obligatorio", status: Status.badRequest });
        if (dto?.price == null || Number(dto.price) <= 0) {
            throw new ApiError({ message: "El precio debe ser mayor a cero", status: Status.badRequest });
        }
        if (!dto?.categoryId) {
            throw new ApiError({ message: "La categoría es obligatoria", status: Status.badRequest });
        }

        const exists = await dishQueryRepo2.findByName(dto.name);
        if (exists) throw new ApiError({ message: "Ya existe un plato con ese nombre", status: Status.conflict });

        const categoryExists = await categoryQueryRepo2.findById(dto.categoryId);
        if (!categoryExists) throw new ApiError({ message: "La categoría no existe", status: Status.badRequest });

        const entity = makeDish(dto);
        const dishCreated = await dishCommandRepo2.create(entity);
        return { dish: dishCreated, category: categoryExists };
    };
}
