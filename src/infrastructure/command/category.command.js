
export function categoryCommandRepository({ models }) {
    const { Category } = models;

    return {
        async create({ name, description = null, order = 0 }, options = {}) {
            const row = await Category.create(
                { name, description, order },
                { transaction: options.transaction }
            );
            return row.get();
        },

        async updateById(id, payload = {}, options = {}) {
            const row = await Category.findByPk(id, { transaction: options.transaction });
            if (!row) return null;

            const { name, description, order } = payload;

            if (name !== undefined) row.name = name;
            if (description !== undefined) row.description = description;
            if (order !== undefined) row.order = order;

            await row.save({ transaction: options.transaction });
            return row.get();
        },

        async deleteById(id, options = {}) {
            const count = await Category.destroy({ where: { id }, transaction: options.transaction });
            return count > 0;
        }
    };
}

export default categoryCommandRepository;
