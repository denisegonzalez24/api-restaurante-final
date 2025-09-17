export const assertCategoryRepoCommand = (repo) => {
    const required = ['create', 'updateById', 'deleteById'];
    for (const fn of required) {
        if (typeof repo?.[fn] !== 'function') {
            throw new TypeError(`CategoryRepoCommand inválido: falta ${fn}()`);
        }
    }
    return repo;
};
