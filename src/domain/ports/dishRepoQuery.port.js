export const DishRepoMethods = Object.freeze([
    "findByName", "findAll", "findById"
]);

export function assertDishRepoQuery(repo) {
    for (const m of DishRepoMethods) {
        if (typeof repo[m] !== "function") throw new Error(`DishRepo inválido: falta "${m}"`);
    }
    return repo;
}
