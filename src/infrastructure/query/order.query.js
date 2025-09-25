import { Op } from "sequelize";

export function orderQueryRepository({ models }) {
    const { Order, OrderItem, Dish, Status, DeliveryType, Category } = models;
    return {
        models,

        async findById(id) {
            const row = await Order.findByPk(id, {
                include: [
                    { model: Status, as: "overallStatus", attributes: ["id", "name"] },
                    { model: DeliveryType, as: "deliveryType", attributes: ["id", "name"] },
                    {
                        model: OrderItem, as: "items",
                        include: [
                            { model: Status, as: "status", attributes: ["id", "name"] },
                            {
                                model: Dish, as: "dish", attributes: ["id", "name", "price", "imageUrl"],
                                include: [{ model: Category, as: "category", attributes: ["id", "name"] }]
                            },
                        ],
                    },
                ],
                order: [[{ model: OrderItem, as: "items" }, "id", "ASC"]],
            });
            return row ? row.get() : null;
        },

        async findAll({ date, status } = {}) {
            const where = {};
            if (date) {
                const start = new Date(`${date}T00:00:00.000Z`);
                const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                where.createDate = { [Op.gte]: start, [Op.lt]: end };
            }

            if (status != null) {

                if (Number.isFinite(+status)) {
                    where.overallStatusId = +status;
                } else {

                    const sts = await Status.findOne({ where: { name: status } });
                    where.overallStatusId = sts?.id ?? -1;
                }
            }

            const rows = await Order.findAll({
                where,
                include: [
                    { model: Status, as: "overallStatus", attributes: ["id", "name"] },
                    { model: DeliveryType, as: "deliveryType", attributes: ["id", "name"] },
                ],
                order: [["id", "DESC"]],
            });

            return rows.map((r) => r.get());
        },

        async hasOrderItemsForDish(dishId) {
            const count = await OrderItem.count({ where: { dishId } });
            return count > 0;
        },
    };

}
