// src/infrastructure/command/order.command.js
import { Sequelize } from "sequelize";

export function orderCommandRepository({ models }) {
    const { Order, OrderItem, Dish, Status } = models;
    const sequelize = Order.sequelize;

    async function recalcTotal(orderId, t) {
        const items = await OrderItem.findAll({
            where: { orderId },
            include: [{ model: Dish, as: "dish", attributes: ["price"] }],
            transaction: t,
        });
        const total = items.reduce(
            (acc, it) => acc + Number(it.quantity || 0) * Number(it.dish?.price || 0),
            0
        );
        await Order.update({ price: total }, { where: { id: orderId }, transaction: t });
        return total;
    }

    async function computeOrderStatus(orderId, t) {
        const items = await OrderItem.findAll({ where: { orderId }, transaction: t });
        if (items.length === 0) return;

        const ids = items.map(i => i.statusId).filter(Boolean);
        const minStatusId = Math.min(...ids);

        await Order.update(
            { overallStatusId: minStatusId },
            { where: { id: orderId }, transaction: t }
        );
    }
    return {
        async create(body) {
            return sequelize.transaction(async (t) => {
                const stPending = await Status.findOne({ where: { name: "Pending" }, transaction: t });

                const order = await Order.create(
                    {
                        deliveryTo: body?.deliveryTo ?? null,
                        notes: body?.notes ?? null,
                        price: 0,
                        deliveryTypeId: body?.deliveryTypeId ?? null,
                        overallStatusId: stPending?.id ?? null,
                        createDate: Sequelize.fn("NOW"),
                    },
                    { transaction: t }
                );

                const items = Array.isArray(body?.items) ? body.items : [];
                for (const it of items) {
                    const dish = await Dish.findByPk(it.dishId, { transaction: t });
                    if (!dish) throw new Error("DishNotFound");
                    const qty = Math.max(1, Number(it.quantity || 1));
                    await OrderItem.create(
                        {
                            orderId: order.id,
                            dishId: dish.id,
                            quantity: qty,
                            notes: it?.notes ?? null,
                            statusId: stPending?.id ?? null,
                            createDate: Sequelize.fn("NOW"),
                        },
                        { transaction: t }
                    );
                }

                await recalcTotal(order.id, t);
                await computeOrderStatus(order.id, t);
                return order.get(); // { id, ... }
            });
        },

        async addItem(orderId, { dishId, quantity = 1, notes = null }) {
            return sequelize.transaction(async (t) => {
                const order = await Order.findByPk(orderId, { transaction: t });
                if (!order) throw new Error("OrderNotFound");

                const dish = await Dish.findByPk(dishId, { transaction: t });
                if (!dish) throw new Error("DishNotFound");

                const stPending = await Status.findOne({ where: { name: "Pending" }, transaction: t });

                await OrderItem.create(
                    {
                        orderId: order.id,
                        dishId: dish.id,
                        quantity: Math.max(1, Number(quantity || 1)),
                        notes,
                        statusId: stPending?.id ?? null,
                        createDate: Sequelize.fn("NOW"),
                    },
                    { transaction: t }
                );

                await recalcTotal(order.id, t);
                await computeOrderStatus(order.id, t);
                return { orderId: order.id };
            });
        },

        async updateItemStatus(orderItemId, status) {
            return sequelize.transaction(async (t) => {
                const targetStatus =
                    Number.isFinite(+status)
                        ? await Status.findByPk(+status, { transaction: t })
                        : await Status.findOne({ where: { name: status }, transaction: t });
                if (!targetStatus) throw new Error("InvalidStatus");

                const it = await OrderItem.findByPk(orderItemId, { transaction: t });
                if (!it) throw new Error("OrderItemNotFound");

                await it.update(
                    { statusId: targetStatus.id, updateDate: Sequelize.fn("NOW") },
                    { transaction: t }
                );

                await computeOrderStatus(it.orderId, t);
                return { orderId: it.orderId };
            });
        },

        async updateItemQuantity(orderItemId, quantity) {
            return sequelize.transaction(async (t) => {
                // Validación fina (>=1 entero) debería estar en el use-case;
                // aquí solo evitamos números imposibles por seguridad:
                const q = Number(quantity);
                if (!Number.isFinite(q) || q <= 0) throw new Error("InvalidQuantity");

                const it = await OrderItem.findByPk(orderItemId, { transaction: t });
                if (!it) throw new Error("OrderItemNotFound");

                await it.update(
                    { quantity: Math.trunc(q), updateDate: Sequelize.fn("NOW") },
                    { transaction: t }
                );

                await recalcTotal(it.orderId, t);
                await computeOrderStatus(it.orderId, t);
                return { orderId: it.orderId };
            });
        },
    };
}
