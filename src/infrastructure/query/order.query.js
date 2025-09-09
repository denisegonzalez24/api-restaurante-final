import { Op } from "sequelize";

export function orderQueryRepository({ models }) {
    const { Order, OrderItem, Dish, Status, DeliveryType, Category } = models;

    return {
        async findById(id) {
            const row = await Order.findByPk(id, {
                include: [
                    { model: Status, as: "status" },
                    { model: DeliveryType, as: "deliveryType" },
                    {
                        model: OrderItem,
                        as: "items",
                        include: [
                            { model: Status, as: "status" },
                            { model: Dish, as: "dish", include: [{ model: Category, as: "category" }] },
                        ],
                    },
                ],
                order: [[{ model: OrderItem, as: "items" }, "id", "ASC"]],
            });
            return row ? row.get({ plain: true }) : null;
        },

        async findAll({ date, status } = {}) {
            const where = {};
            if (date) {
                const from = new Date(`${date}T00:00:00`);
                const to = new Date(`${date}T23:59:59.999`);
                where.createDate = { [Op.between]: [from, to] };
            }
            if (status) {
                if (Number.isFinite(+status)) {
                    where.statusId = +status;
                } else {
                    const st = await Status.findOne({ where: { name: status } });
                    if (st) where.statusId = st.id;
                }
            }

            const rows = await Order.findAll({
                where,
                include: [
                    { model: Status, as: "status" },
                    { model: DeliveryType, as: "deliveryType" },
                ],
                order: [["id", "DESC"]],
            });

            return rows.map(r => r.get());
        },
    };
}
