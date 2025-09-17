export const makeDeleteCategory = ({ categoryRepoQuery, categoryRepoCommand, dishRepoQuery }) => async (id) => {
    const exists = await categoryRepoQuery.existsById(id);
    if (!exists) { const e = new Error('Categoría no encontrada'); e.status = 404; throw e; }

    // Regla: no eliminar si hay platos asociados a la categoría
    const dishCount = await dishRepoQuery.countByCategoryId(id);
    if (dishCount > 0) { const e = new Error('No se puede eliminar: la categoría tiene platos asociados'); e.status = 409; throw e; }

    await categoryRepoCommand.deleteById(id);
    return; // 204
};
