// Mapea OpenAPI <-> modelo interno
export function toCreateDishDto(body) {
    return {
        name: body.name,
        description: body.description ?? "",
        price: body.price,
        categoryId: body.category,   // OpenAPI: category -> interno: categoryId
        imageUrl: body.image ?? null,
        available: true
    };
}

export function toUpdateDishDto(body) {
    return {
        name: body.name,
        description: body.description,
        price: body.price,
        categoryId: body.category,
        imageUrl: body.image,
        available: body.isActive
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
