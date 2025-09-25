import { assertDishRepoQuery } from "../../domain/ports/dishRepoQuery.port.js";

export function makeGetDishById({ dishQueryRepo }) {
    const repo = assertDishRepoQuery(dishQueryRepo);
    return async function getDishById(id) {
        if (!id) return null;
        return repo.findById(id);
    };
}
