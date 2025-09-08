
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
        name: body?.name,
        description: body?.description ?? null,
        price: Number(body?.price),
        categoryId: Number(body?.category),
        imageUrl: body?.image ?? null,
        // El OpenAPI usa isActive (boolean) => mapeamos a available (boolean)
        available: Boolean(body?.isActive),
    };
}

/**
 * QUERY PARAMS (listado)
 * - OpenAPI:
 *   - name: string (búsqueda parcial)
 *   - category: integer
 *   - sortByPrice: "asc" | "desc"
 *   - onlyActive: boolean (default: true)
 */
export function toListParams(query) {
    return {
        name: query.name || undefined,
        categoryId: query.category ? Number(query.category) : undefined,

        priceOrder: query.sortByPrice ? String(query.sortByPrice).toUpperCase() : undefined,

        onlyActive: query.onlyActive !== undefined ? String(query.onlyActive) === "true" : true
    };
}
