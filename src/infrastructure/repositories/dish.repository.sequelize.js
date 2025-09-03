import { Op } from 'sequelize';
import makeDish from '../../domain/entities/dish.js';

export default function makeDishRepositorySequelize({ models }) {
    const { Dish, Category } = models;

    return {
        async create(entity) {
            const row = await Dish.create({
                name: entity.name,
                description: entity.description,
                price: entity.price,
                available: entity.available ?? true,
                categoryId: entity.categoryId,
                imageUrl: entity.imageUrl
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

        async findAll({ name, categoryId, priceOrder }) {
            const where = {};
            if (name) where.name = { [Op.like]: `%${name}%` };
            if (categoryId) where.categoryId = categoryId;
            const order = priceOrder ? [['price', priceOrder]] : [];
            const rows = await Dish.findAll({
                where, order,
                include: [{ model: Category, attributes: ['id', 'name'] }]
            });
            return rows.map(r => makeDish({ ...r.get() }));
        }
    };
}
