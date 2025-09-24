export const CategoryRepoQueryMethods = Object.freeze([
    "findAll",
    "findById",
    "findByName"
]);

export function assertCategoryRepoQuery(repo) {
    for (const m of CategoryRepoQueryMethods) {
        if (typeof repo[m] !== "function") {
            throw new Error(`CategoryRepoQuery inválido: falta "${m}"`);
        }
    }
    return repo;
}
