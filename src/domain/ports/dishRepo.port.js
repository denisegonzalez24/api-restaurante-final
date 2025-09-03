const methods = ['create', 'findByName', 'findAll', 'update'];

export default function assertDishRepo(repo) {
    for (const m of methods) if (typeof repo[m] !== 'function')
        throw new Error(`DishRepo inválido: falta "${m}"`);
    return repo;
}
