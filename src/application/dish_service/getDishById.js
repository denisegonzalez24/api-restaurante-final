import { assertDishRepoQuery } from "../../domain/ports/dishRepoQuery.port.js";

export function makeGetDishById({ dishQueryRepo, categoryQueryRepo }) {
    const repo = assertDishRepoQuery(dishQueryRepo);
    const categoryRepo = assertDishRepoQuery(categoryQueryRepo);
    return async function getDishById(id) {
        if (!id) return null;

        const dish = await repo.findById(id);
        if (!dish) return null;

        const category = await categoryRepo.findById(dish.categoryId);
        return { ...dish, category };
    };
}
