// src/presentation/controllers/order.controller.js
import Status from "../../shared/status.js";

export function makeOrderController({
    createOrder,
    listOrders,
    getOrderById,
    addItemToOrder,
    removeItemFromOrder,
    updateOrderItemStatus,
    updateOrderItemQuantity
}) {
    return {
        create: async (req, res, next) => {
            try {
                const order = await createOrder(req.body || {});
                res.status(Status.created).json(order);
            } catch (e) { next(e); }
        },

        list: async (req, res, next) => {
            try {
                const { date, status } = req.query || {};
                const result = await listOrders({ date, status });
                res.status(Status.ok).json(result);
            } catch (e) { next(e); }
        },

        getById: async (req, res, next) => {
            try {
                const full = await getOrderById(req.params.id);
                if (!full) return res.status(Status.notFound).json({ message: "Orden no encontrada" });
                res.status(Status.ok).json(full);
            } catch (e) { next(e); }
        },

        addItem: async (req, res, next) => {
            try {
                const { dishId, quantity, notes } = req.body || {};
                const full = await addItemToOrder(req.params.id, { dishId, quantity, notes });
                res.status(Status.created).json(full);
            } catch (e) { next(e); }
        },

        removeItem: async (req, res, next) => {
            try {
                await removeItemFromOrder(req.params.itemId);
                res.status(Status.noContent).send();
            } catch (e) { next(e); }
        },

        updateItemStatus: async (req, res, next) => {
            try {
                const { status } = req.body || {};
                const { orderId, itemId } = req.params;
                const full = await updateOrderItemStatus(orderId, itemId, status);
                res.status(Status.ok).json(full);
            } catch (e) { next(e); }
        },
        updateItemQuantity: async (req, res, next) => {
            try {
                const { quantity } = req.body || {};
                const { orderId, itemId } = req.params;
                const full = await updateOrderItemQuantity(orderId, itemId, quantity);
                res.status(Status.ok).json(full);
            } catch (e) { next(e); }
        }
    };
}

export default makeOrderController;
