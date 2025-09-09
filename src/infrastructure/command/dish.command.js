import { Sequelize } from "sequelize";
import { makeDish } from "../../domain/entities/dish.js";

export function dishCommandRepository({ models }) {
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

        async update(id, patch) {

            const now = Sequelize.fn('NOW');
            const patchWithUpdatedAt = { ...patch, updatedDate: now };

            await Dish.update(patchWithUpdatedAt, { where: { id } });
            const row = await Dish.findByPk(id);
            return row ? makeDish({ ...row.get() }) : null;
        },

    };
}
