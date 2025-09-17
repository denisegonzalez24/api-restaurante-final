export const makeGetCategoryById = ({ categoryRepoQuery }) => async (id) => {
    const cat = await categoryRepoQuery.findById(id);
    if (!cat) {
        const err = new Error('Categoría no encontrada');
        err.status = 404;
        throw err;
    }
    return { id: cat.id, name: cat.name, description: cat.description, order: cat.order };
};
