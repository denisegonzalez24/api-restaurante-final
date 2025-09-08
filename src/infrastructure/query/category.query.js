export function categoryQueryRepository({ models }) {
    const { Category } = models;
    return {
        async findById(id) {
            const row = await Category.findOne({ where: { id } });
            return row ? row.get() : null;
        },
    };
}
