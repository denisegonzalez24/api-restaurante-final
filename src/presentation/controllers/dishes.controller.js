
import Status from "../../shared/status.js";
import handleError from "../middleware/handler_error.js";

export default function makeDishesController({ dishesService }) {
    return {
        create: async (req, res) => {
            try {
                const dish = await dishesService.create(req.body);
                res.status(Status.created).json(dish);
            } catch (e) {
                if (e.code === 'DUPLICATE') return res.status(Status.conflict).json({ error: e.message });
                res.status(Status.ok).json({ error: e.message });
            }
        },
        list: async (req, res) => {
            try {
                const dishes = await dishesService.list(req.query);
                res.json(dishes);

            } catch (e) {
                handleError(req, res, e);
            }
        },
        update: async (req, res) => {
            try {
                const dish = await dishesService.update(req.params.id, req.body);
                if (!dish) return res.status(Status.notFound).json({ message: 'Not found' });
                res.json(dish);
            } catch (e) {
                res.status(Status.badRequest).json({ error: e.message });
            }
        }
    };
}
