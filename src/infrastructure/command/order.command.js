import { Sequelize } from "sequelize";

export function orderCommandRepository({ models }) {
    const { Order, OrderItem, Dish, Status } = models;
    const sequelize = Order.sequelize; // usa la misma conexión del modelo

    async function recalcTotal(orderId, t) {
        const items = await OrderItem.findAll({ where: { orderId }, transaction: t });
        const total = items.reduce((acc, it) => acc + Number(it.total || 0), 0);
        await Order.update({ total }, { where: { id: orderId }, transaction: t });
        return total;
    }

    async function computeOrderStatus(orderId, t) {
        // Reglas simples por nombres estándar: Pending/InProgress/Ready/Delivered
        const items = await OrderItem.findAll({
            where: { orderId },
            include: [{ model: Status, as: "status" }],
            transaction: t,
        });
        const names = items.map(i => i.status?.name);

        let next = "Pending";
        if (names.length && names.every(n => n === "Delivered")) next = "Delivered";
        else if (names.length && names.every(n => n === "Ready")) next = "Ready";
        else if (names.some(n => n === "InProgress")) next = "InProgress";
        else next = "Pending";

        const st = await Status.findOne({ where: { name: next }, transaction: t });
        await Order.update({ statusId: st.id }, { where: { id: orderId }, transaction: t });
        return st.id;
    }

    return {
        async create({ deliveryTypeId, deliveryTo, items = [] }) {
            return sequelize.transaction(async (t) => {
                const pending = await Status.findOne({ where: { name: "Pending" }, transaction: t });
                const now = Sequelize.fn("NOW");

                const order = await Order.create(
                    { deliveryTypeId, deliveryTo, statusId: pending.id, total: 0, updateDate: now },
                    { transaction: t }
                );

                for (const it of items) {
                    const dish = await Dish.findByPk(it.dishId, { transaction: t });
                    if (!dish || !dish.get().available) throw new Error(`Dish ${it.dishId} no disponible`);

                    const qty = Number(it.quantity || 1);
                    const unitPrice = Number(dish.get().price);

                    await OrderItem.create(
                        {
                            orderId: order.id,
                            dishId: dish.id,
                            quantity: qty,
                            notes: it.notes ?? null,
                            unitPrice,
                            total: unitPrice * qty,
                            statusId: pending.id,
                            updateDate: now,
                        },
                        { transaction: t }
                    );
                }

                await recalcTotal(order.id, t);
                await computeOrderStatus(order.id, t);

                // devolvés el POJO de la orden recién creada
                const row = await Order.findByPk(order.id, { transaction: t });
                return row ? row.get() : null;
            });
        },

        async addItem(orderId, { dishId, quantity = 1, notes = null }) {
            return sequelize.transaction(async (t) => {
                const pending = await Status.findOne({ where: { name: "Pending" }, transaction: t });
                const dish = await Dish.findByPk(dishId, { transaction: t });
                if (!dish || !dish.get().available) throw new Error(`Dish ${dishId} no disponible`);

                const now = Sequelize.fn("NOW");
                const unitPrice = Number(dish.get().price);

                await OrderItem.create(
                    {
                        orderId,
                        dishId,
                        quantity,
                        notes,
                        unitPrice,
                        total: unitPrice * Number(quantity),
                        statusId: pending.id,
                        updateDate: now,
                    },
                    { transaction: t }
                );

                await recalcTotal(orderId, t);
                await computeOrderStatus(orderId, t);
            });
        },

        async removeItem(orderItemId) {
            return sequelize.transaction(async (t) => {
                const it = await OrderItem.findByPk(orderItemId, { transaction: t });
                if (!it) return;
                await OrderItem.destroy({ where: { id: orderItemId }, transaction: t });
                await recalcTotal(it.orderId, t);
                await computeOrderStatus(it.orderId, t);
            });
        },

        async updateItemStatus(orderItemId, status) {
            return sequelize.transaction(async (t) => {
                const st = Number.isFinite(+status)
                    ? await Status.findByPk(+status, { transaction: t })
                    : await Status.findOne({ where: { name: status }, transaction: t });
                if (!st) throw new Error("Status inválido");

                const it = await OrderItem.findByPk(orderItemId, { transaction: t });
                if (!it) throw new Error("Item no encontrado");

                await it.update({ statusId: st.id, updateDate: Sequelize.fn("NOW") }, { transaction: t });
                await computeOrderStatus(it.orderId, t);
            });
        },
    };
}
