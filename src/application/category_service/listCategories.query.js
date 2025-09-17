export const makeListCategories = ({ categoryRepoQuery }) => async () => {
    const cats = await categoryRepoQuery.findAll();
    // ya vienen ordenadas por "order"
    return cats.map(c => ({ id: c.id, name: c.name, description: c.description, order: c.order }));
};
