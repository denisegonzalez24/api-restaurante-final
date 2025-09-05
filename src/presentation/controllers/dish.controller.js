
import Status from "../../shared/status.js";
import { toCreateDishDto, toUpdateDishDto, toListParams } from "../mappers/dish.mapper.js";

// Controller recibe casos de uso (CQRS) por DI
export function makeDishController({ createDish, updateDish, listDishes }) {
    return {
        create: async (req, res, next) => {
            try {
                const dto = toCreateDishDto(req.body);
                const result = await createDish(dto);
                res.status(Status.created).json(result);
            } catch (e) { next(e); }
        },
        list: async (req, res, next) => {
            try {
                const params = toListParams(req.query);
                const result = await listDishes(params);
                res.status(Status.ok).json(result);
            } catch (e) { next(e); }
        },
        update: async (req, res, next) => {
            try {
                const dto = toUpdateDishDto(req.body);
                const result = await updateDish(req.params.id, dto);
                res.status(Status.ok).json(result);
            } catch (e) { next(e); }
        }
    };
}
