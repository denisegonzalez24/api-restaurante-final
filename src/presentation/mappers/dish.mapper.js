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
export function toDishResponse(model) {
    return {
        id: model.id,
        name: model.name,
        description: model.description ?? null,
        price: Number(model.price),
        category: toGenericResponse(model.category.id),
        image: model.imageUrl ?? null,
        isActive: !!model.available,
        createdAt: model.createDate?.toISOString?.() ?? null,
        updatedAt: model.updateDate?.toISOString?.() ?? null,
    };
}
export function toDishesResponse(list) { return list.map(toDishResponse); }
