
export function mapCategoryModelToResponse(row) {
    const r = (typeof row.get === "function") ? row.get() : row;
    return {
        id: Number(r.id),
        name: r.name ?? null,
        description: r.description ?? null,
        order: Number(r.order ?? 0),
    };
}
