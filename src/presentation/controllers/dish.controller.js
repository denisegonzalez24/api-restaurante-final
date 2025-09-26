
import Status from "../../shared/status.js";
import { toCreateDishDto, toUpdateDishDto, toListParams, toDishesResponse, toDishResponse } from "../mappers/dish.mapper.js";


export function makeDishController({ createDish, getDishById, updateDish, listDishes, deleteDish }) {
    return {
        create: async (req, res, next) => {
            try {
                const dto = toCreateDishDto(req.body);
                const result = await createDish(dto);
                res.status(Status.created).json(toDishResponse({ dish: result.dish, category: result.category }));
            } catch (e) { next(e); }
        },
        getById: async (req, res, next) => {
            try {
                const dish = await getDishById(req.params.id);
                res.status(Status.ok).json(toDishResponse({ dish, category: dish.category }));
            } catch (e) { next(e); }
        },
        list: async (req, res, next) => {
            try {
                const params = toListParams(req.query);
                const result = await listDishes(params);
                res.status(Status.ok).json(toDishesResponse(result));
            } catch (e) { next(e); }
        },
        update: async (req, res, next) => {
            try {
                const { items = [], orderId } = req.body ?? {};
                if (!Array.isArray(items)) {
                    return res.status(Status.badRequest).json({ message: "Formato inválido: 'items' debe ser un array" });
                }
                // 👇  OJO: ahora inyectamos updateOrderItems (no usamos application.* aquí)
                const updated = await updateOrderItems({ items, orderId, ctx: req });

                return res.status(Status.ok).json(toOrderUpdateResponse(updated));
            } catch (e) { next(e); }
        },
        delete: async (req, res, next) => {
            try {
                const idDelete = req.params.id;
                const before = await application.dish.getById({ id: idDelete });
                const one = before ?? (Array.isArray(result) ? result[0] : result);
                const result = await deleteDish(idDelete);
                return res.status(Status.ok).json(toDishResponse(one));
            } catch (e) { next(e); }
        }
    };
}

