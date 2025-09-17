// src/infrastructure/command/categoryCommandRepo.js

/**
 * Repo de comandos para Category.
 * Métodos:
 *  - create({ name, description, order }, { transaction })
 *  - updateById(id, { name?, description?, order? }, { transaction })
 *  - deleteById(id, { transaction })
 *
 * Devuelve plain objects (row.get()) para encajar con tus mappers/UCs.
 */
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
            await Category.destroy({ where: { id }, transaction: options.transaction });
        },
    };
}

export default categoryCommandRepository;
