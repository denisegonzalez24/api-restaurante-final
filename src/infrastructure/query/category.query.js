// src/infrastructure/query/categoryQueryRepo.js
import { Op } from "sequelize";

/**
 * Métodos expuestos:
 *  - findAll()
 *  - findById(id)
 *  - findByName(name)
 *  - existsById(id)
 *  - existsByName(name)
 *  - existsByNameExcludingId(name, excludeId)
 */
export function categoryQueryRepository({ models }) {
    const { Category } = models;

    return {
        async findAll() {
            const rows = await Category.findAll({
                order: [["order", "ASC"], ["id", "ASC"]],
            });
            return rows.map((r) => r.get());
        },

        async findById(id) {
            const row = await Category.findByPk(id);
            return row ? row.get() : null;
        },

        async findByName(name) {
            const row = await Category.findOne({ where: { name } });
            return row ? row.get() : null;
        },

        async existsById(id) {
            const c = await Category.count({ where: { id } });
            return c > 0;
        },

        async existsByName(name) {
            const c = await Category.count({ where: { name } });
            return c > 0;
        },

        async existsByNameExcludingId(name, excludeId) {
            const c = await Category.count({
                where: { name, id: { [Op.ne]: excludeId } },
            });
            return c > 0;
        },
    };
}

export default categoryQueryRepository;
