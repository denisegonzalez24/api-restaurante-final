import { Op } from "sequelize";
import { makeDish } from "../../domain/entities/dish.js";

export function makeDishRepositorySequelize({ models }) {
    const { Dish, Category } = models;

    return {
        async create(entity) {
            const row = await Dish.create({
                name: entity.name,
                description: entity.description,
                price: entity.price,
                available: entity.available ?? true,
                imageUrl: entity.imageUrl,
                categoryId: entity.categoryId
            });
            return makeDish({ ...row.get() });
        },

        async findByName(name) {
            const row = await Dish.findOne({ where: { name } });
            return row ? makeDish({ ...row.get() }) : null;
        },

        async update(id, patch) {
            await Dish.update(patch, { where: { id } });
            const row = await Dish.findByPk(id);
            return row ? makeDish({ ...row.get() }) : null;
        },

        async findAll({ name, categoryId, priceOrder, onlyActive = true }) {
            const where = {};
            if (name && typeof name === "string") {
                where.name = { [ILIKE]: `%${name}%` };
            }
            if (categoryId) where.categoryId = categoryId;
            if (onlyActive) where.available = true;

            const order = priceOrder ? [["price", priceOrder]] : [];

            const rows = await Dish.findAll({
                where, order,
                include: [{ model: Category, attributes: ["id", "name"] }]
            });
            return rows.map(r => makeDish({ ...r.get() }));
        }
    };
}
