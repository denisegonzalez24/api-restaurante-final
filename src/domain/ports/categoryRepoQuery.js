export const CategoryRepoMethods = Object.freeze([
    "findById"
]);

export function assertCategoryRepoQuery(repo) {
    for (const m of CategoryRepoMethods) {
        if (typeof repo[m] !== "function") throw new Error(`CategoryRepo inválido: falta "${m}"`);
    }
    return repo;
}
