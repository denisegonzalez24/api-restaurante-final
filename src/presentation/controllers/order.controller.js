import Status from "../../shared/status.js";
import { createOrderToCommand, toOrderCreateResponse, toOrderDetailsResponse, toOrderDetailsResponseList, toOrderUpdateResponse } from "../mappers/order_mapper.js";


export function makeOrderController({
    createOrder,
    listOrders,
    getOrderById,
    addItemToOrder,
    updateOrderItems,
    updateOrderItemStatus
}) {
    return {
        create: async (req, res, next) => {
            try {
                const payload = createOrderToCommand(req.body);
                const order = await createOrder(payload);
                res.status(Status.created).json(toOrderCreateResponse(order));
            } catch (e) { next(e); }
        },

        list: async (req, res, next) => {
            try {
                const { from, to, status } = req.query || {};
                const result = await listOrders({ from, to, status });
                res.status(Status.ok).json(toOrderDetailsResponseList(result));
            } catch (e) { next(e); }
        },

        getById: async (req, res, next) => {
            try {
                const full = await getOrderById(req.params.id);
                res.status(Status.ok).json(toOrderDetailsResponse(full));
            } catch (e) { next(e); }
        },

        addItem: async (req, res, next) => {
            try {
                const { dishId, quantity, notes } = req.body || {};
                const result = await addItemToOrder(req.params.id, { dishId, quantity, notes });
                res.status(Status.created).json({ message: "Item added successfully", data: toOrderDetailsResponse(result) });
            } catch (e) { next(e); }
        },
        updateItemStatus: async (req, res, next) => {
            try {
                const { status } = req.body || {};
                const orderId = req.params.orderId ?? req.params.id;
                const itemId = req.params.itemId;
                const result = await updateOrderItemStatus(orderId, itemId, status);
                return res.status(Status.ok).json(toOrderUpdateResponse(result));
            } catch (e) { next(e); }
        },
        update: async (req, res, next) => {
            try {
                const { items = [], orderId } = req.body ?? {};
                if (!Array.isArray(items)) {
                    return res.status(Status.badRequest).json({ message: "Formato inválido: 'items' debe ser un array" });
                }
                const updated = await updateOrderItems({ items, orderId });

                return res.status(Status.ok).json(toOrderUpdateResponse(updated));

            } catch (e) { next(e); }
        }
    };
}
export default makeOrderController;
