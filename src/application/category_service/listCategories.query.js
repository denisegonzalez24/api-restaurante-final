import { assertCategoryRepoQuery } from "../../domain/ports/categoryRepoQuery.port.js";

export function makeListCategories({ categoryQueryRepo }) {
    const repo = assertCategoryRepoQuery(categoryQueryRepo);
    return async function listCategories() {
        return repo.findAll();
    };
}
