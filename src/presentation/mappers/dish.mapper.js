// src/presentation/mappers/dish.mapper.js

/**
 * Helpers
 */
function parseBoolean(value, defaultValue = true) {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === "boolean") return value;
    const s = String(value).trim().toLowerCase();
    if (s === "true") return true;
    if (s === "false") return false;
    return defaultValue;
}

function normalizePriceOrder(raw) {
    // OpenAPI enum: "asc" | "desc" (minúsculas)
    // Aceptamos lo que define la consigna y normalizamos internamente a "ASC"/"DESC" para Sequelize.
    if (!raw) return undefined;
    const s = String(raw).trim().toLowerCase();
    if (s === "asc") return "ASC";
    if (s === "desc") return "DESC";
    return undefined; // cualquier otro valor queda fuera para respetar la especificación
}

/**
 * REQUEST DTOs (entradas)
 * - Se ajustan a la API que define el OpenAPI:
 *   - body.category (int) -> categoryId (FK)
 *   - body.image -> imageUrl
 *   - body.isActive -> available
 */

export function toCreateDishDto(body) {
    return {
        name: body?.name,
        // OpenAPI permite nullable: true. Si no viene, lo dejamos en null para que el response sea consistente.
        description: body?.description ?? null,
        price: Number(body?.price),
        categoryId: Number(body?.category),
        imageUrl: body?.image ?? null,
        // Por defecto los platos creados quedan activos (la consigna permite esto).
        available: true,
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
        name: query?.name || undefined,
        categoryId: query?.category ? Number(query.category) : undefined,
        priceOrder: normalizePriceOrder(query?.sortByPrice), // "ASC" | "DESC" | undefined
        onlyActive: parseBoolean(query?.onlyActive, true),
    };
}

/**
 * RESPONSE DTO (salidas)
 * - Debe coincidir exactamente con DishResponse del OpenAPI:
 *   {
 *     id: string(uuid),
 *     name: string,
 *     description: string|null,
 *     price: number,
 *     category: { id: int, name: string|null },
 *     image: string|null,
 *     isActive: boolean,
 *     createdAt: date-time string,
 *     updatedAt: date-time string
 *   }
 */
export function toDishResponse(entity, category) {
    return {
        id: String(entity.id),
        name: entity.name,
        description: entity.description ?? null,
        price: Number(entity.price),
        category: {
            id: Number(category?.id ?? entity.categoryId),
            name: category?.name ?? null,
        },
        image: entity.imageUrl ?? null,
        isActive: Boolean(entity.available),
        createdAt:
            typeof entity.createDate?.toISOString === "function"
                ? entity.createDate.toISOString()
                : entity.createDate ?? null,
        updatedAt:
            typeof entity.updateDate?.toISOString === "function"
                ? entity.updateDate.toISOString()
                : entity.updateDate ?? null,
    };
}
