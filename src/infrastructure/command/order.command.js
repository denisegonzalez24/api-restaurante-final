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

        const statuses = Array.from(new Set(items.map((i) => i.statusId).filter(Boolean)));
        let newStatusId;

        if (statuses.length === 1) {
            newStatusId = statuses[0]; // todos iguales -> la orden toma ese estado
        } else {
            const current = await Order.findByPk(orderId, { transaction: t });
            newStatusId = current?.overallStatusId ?? null; // conserva el actual
        }
        if (newStatusId) {
            await Order.update(
                { overallStatusId: newStatusId },
                { where: { id: orderId }, transaction: t }
            );
        }
    }

    return {

        // Crea la orden con items (todos en Pending) y recalcula total/estado
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
                    if (!dish) {
                        const e = new Error("Dish no encontrado"); e.status = 404; throw e;
                    }
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
                return order.get();
            });
        },

        // Agrega un plato a la orden (item en Pending) y recalcula total/estado
        async addItem(orderId, { dishId, quantity = 1, notes = null }) {
            return sequelize.transaction(async (t) => {
                const order = await Order.findByPk(orderId, { transaction: t });
                if (!order) { const e = new Error("Orden no encontrada"); e.status = 404; throw e; }

                const dish = await Dish.findByPk(dishId, { transaction: t });
                if (!dish) { const e = new Error("Dish no encontrado"); e.status = 404; throw e; }

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
                // devolvemos orderId por conveniencia (no es obligatorio)
                return { orderId: order.id };
            });
        },

        // Cambia el estado de un ítem y sincroniza el estado de la orden si corresponde
        async updateItemStatus(orderItemId, status) {
            return sequelize.transaction(async (t) => {
                const targetStatus =
                    Number.isFinite(+status)
                        ? await Status.findByPk(+status, { transaction: t })
                        : await Status.findOne({ where: { name: status }, transaction: t });
                if (!targetStatus) { const e = new Error("Status inválido"); e.status = 400; throw e; }

                const it = await OrderItem.findByPk(orderItemId, { transaction: t });
                if (!it) { const e = new Error("Item no encontrado"); e.status = 404; throw e; }

                await it.update(
                    { statusId: targetStatus.id, updateDate: Sequelize.fn("NOW") },
                    { transaction: t }
                );

                await computeOrderStatus(it.orderId, t);
                return { orderId: it.orderId };
            });
        },

        // NUEVO: cambia la cantidad de un ítem y recalcula total/estado
        async updateItemQuantity(orderItemId, quantity) {
            return sequelize.transaction(async (t) => {
                const q = Number(quantity);
                if (!Number.isInteger(q) || q <= 0) {
                    const e = new Error("quantity inválida"); e.status = 400; throw e;
                }

                const it = await OrderItem.findByPk(orderItemId, { transaction: t });
                if (!it) { const e = new Error("Item no encontrado"); e.status = 404; throw e; }

                await it.update(
                    { quantity: q, updateDate: Sequelize.fn("NOW") },
                    { transaction: t }
                );

                await recalcTotal(it.orderId, t);
                await computeOrderStatus(it.orderId, t);
                return { orderId: it.orderId };
            });
        },

    };
}
