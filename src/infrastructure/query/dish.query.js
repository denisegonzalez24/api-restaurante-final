import { Op } from "sequelize";
import { ORDER } from "../../shared/constants.js";


export function dishQueryRepository({ models }) {
    const { Dish, Category } = models;
    return {
        async findByName(name) {
            const row = await Dish.findOne({ where: { name } });
            return row ? row.get() : null;
        },
        async findById(id) {
            const row = await Dish.findByPk(id);
            return row ? row.get() : null;
        },

        async findAll({ name, categoryId, priceOrder, onlyActive = true } = {}) {
            const where = {};
            if (name) where.name = { [Op.iLike]: `%${name}%` };
            if (categoryId) where.categoryId = categoryId;
            if (onlyActive) where.available = true;

            const sort = (sortByPrice === "desc" ? ORDER.DESC : sortByPrice === "asc" ? ORDER.ASC : null);
            const order = sort ? [["price", sort]] : undefined;

            const rows = await Dish.findAll({
                where,
                include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
                order,
            });
            return rows.map(r => r.get());
        },
    };
}
