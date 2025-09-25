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
    const name = (query.name ?? "").trim() || undefined;
    const category = query.category !== undefined && query.category !== "" ? Number(query.category) : undefined;
    const onlyActive = query.onlyActive === undefined ? true : String(query.onlyActive) === "true";
    const raw = String(query.sortByPrice ?? "").trim().toLowerCase();
    const priceOrder = raw === "asc" ? "ASC" : raw === "desc" ? "DESC" : undefined;

    return { name, category, onlyActive, priceOrder };
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
export function toDishesResponse(list) { return list.map(item => toDishResponse({ dish: item, category: item.category })); }


export function mapDishShort(dish) {
    if (!dish) return null;
    return {
        id: dish.id,
        name: dish.name ?? null,
        image: dish.imageUrl ?? null,
    };
}