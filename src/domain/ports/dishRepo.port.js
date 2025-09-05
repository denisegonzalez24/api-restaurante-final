export const DishRepoMethods = Object.freeze([
    "create", "update", "findByName", "findAll"
]);

export function assertDishRepo(repo) {
    for (const m of DishRepoMethods) {
        if (typeof repo[m] !== "function") throw new Error(`DishRepo inválido: falta "${m}"`);
    }
    return repo;
}
