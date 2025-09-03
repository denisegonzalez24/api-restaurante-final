import makeDish from "../../domain/entities/dish.js";
import assertDishRepo from "../../domain/ports/dishRepo.port.js";

export default function makeDishesService({ dishRepo }) {
    const repo = assertDishRepo(dishRepo);

    return {
        async create(dto) {
            const exists = await repo.findByName(dto.name);
            if (exists) { const e = new Error('Dish name already exists'); e.code = 'DUPLICATE'; throw e; }
            const entity = makeDish(dto);
            return await repo.create(entity);
        },

        async list(params) {
            const allowed = ['ASC', 'DESC'];
            if (params?.priceOrder && !allowed.includes(params.priceOrder))
                throw new Error('priceOrder must be ASC or DESC');
            return repo.findAll(params || {});
        },

        async update(id, dto) {
            if (dto.price != null) {
                const n = Number(dto.price);
                if (isNaN(n) || n < 0) throw new Error('Precio inválido');
            }
            return repo.update(id, dto);
        }
    };
}
