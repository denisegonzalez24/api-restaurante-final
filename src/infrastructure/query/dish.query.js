import { Op } from "sequelize";



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

        async findAll({ name, category, onlyActive = true, priceOrder } = {}) {
            const where = {};
            if (name) where.name = { [Op.iLike]: `%${name}%` };
            if (category !== undefined) where.categoryId = Number(category);
            if (onlyActive) where.available = true;

            const order = priceOrder ? [["price", priceOrder]] : undefined;

            const rows = await Dish.findAll({
                where,
                include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
                order,
            });

            return rows.map(r => r.get());
        },
    };
}
