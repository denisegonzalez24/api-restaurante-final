import Status from "../../shared/status.js";
import { createOrderToCommand, toOrderCreateResponse, toOrderDetailsResponse, toOrderDetailsResponseList } from "../mappers/order_mapper.js";


export function makeOrderController({
    createOrder,
    listOrders,
    getOrderById,
    addItemToOrder,
    updateOrderItemStatus,
    updateOrderItemQuantity
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
                const { date, status } = req.query || {};
                const result = await listOrders({ date, status });
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
                res.status(Status.created).json(toOrderDetailsResponse(result));
            } catch (e) { next(e); }
        },
        updateItemStatus: async (req, res, next) => {
            try {
                const { status } = req.body || {};
                const { orderId, itemId } = req.params;
                const result = await updateOrderItemStatus(orderId, itemId, status);
                res.status(Status.ok).json(toOrderDetailsResponse(result));
            } catch (e) { next(e); }
        },
        updateItemQuantity: async (req, res, next) => {
            try {
                const { quantity } = req.body || {};
                const { orderId, itemId } = req.params;
                const result = await updateOrderItemQuantity(orderId, itemId, quantity);
                res.status(Status.ok).json(toOrderDetailsResponse(result));
            } catch (e) { next(e); }
        }
    };
}

export default makeOrderController;
