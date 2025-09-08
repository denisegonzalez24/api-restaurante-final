export const DishRepoMethods = Object.freeze([
    "create", "update"
]);

export function assertDishRepoCommand(repo) {
    for (const m of DishRepoMethods) {
        if (typeof repo[m] !== "function") throw new Error(`DishRepo inválido: falta "${m}"`);
    }
    return repo;
}
