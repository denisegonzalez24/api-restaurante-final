
import Status from "../../shared/status.js";
import { toCreateDishDto, toUpdateDishDto, toListParams, toDishesResponse, toDishResponse } from "../mappers/dish.mapper.js";


export function makeDishController({ createDish, updateDish, listDishes }) {
    return {
        create: async (req, res, next) => {
            try {
                const dto = toCreateDishDto(req.body);
                const result = await createDish(dto);
                res.status(Status.created).json(toDishResponse(result));
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
                const dto = toUpdateDishDto(req.body);
                const result = await updateDish(req.params.id, dto);
                res.status(Status.ok).json(toDishResponse(result));
            } catch (e) { next(e); }
        }
    };
}

