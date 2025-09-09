import { toGenericResponse } from "./generic.mapper.js";


export function toCreateDishDto(body) {
    return {
        name: body.name,
        description: body.description ?? "",
        price: body.price,
        categoryId: body.category,
        imageUrl: body.image ?? null,
        available: true
    };
}

export function toUpdateDishDto(body) {
    return {
        name: body?.name,
        description: body?.description ?? null,
        price: Number(body?.price),
        categoryId: Number(body?.category),
        imageUrl: body?.image ?? null,
        available: Boolean(body?.isActive),
    };
}

export function toListParams(query) {
    return {
        name: query.name || undefined,
        categoryId: query.category ? Number(query.category) : undefined,
        priceOrder: query.sortByPrice ? String(query.sortByPrice).toUpperCase() : undefined,
        onlyActive: query.onlyActive !== undefined ? String(query.onlyActive) === "true" : true
    };
}
export function toDishResponse({ dish, category }) {
    console.log(dish);
    return {
        id: dish.id,
        name: dish.name,
        description: dish.description ?? null,
        price: Number(dish.price),
        category: toGenericResponse(category),
        image: dish.imageUrl ?? null,
        isActive: !!dish.available,
        createdAt: dish.createDate?.toISOString?.() ?? null,
        updatedAt: dish.updateDate?.toISOString?.() ?? null,
    };
}
export function toDishesResponse(list) { return list.map(toDishResponse); }
