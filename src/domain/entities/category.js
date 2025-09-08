export function makeCategory({
    id = null,
    name,
    order = null
}) {
    if (id !== null) {
        const parsedId = Number(id);
        if (isNaN(parsedId) || parsedId <= 0) {
            throw new Error("ID de categoría inválido");
        }
        id = parsedId;
    }
    if (!name || typeof name !== "string") {
        throw new Error("Nombre de categoría inválido");
    }
    if (order !== null) {
        const parsedOrder = Number(order);
        if (isNaN(parsedOrder) || parsedOrder < 0) {
            throw new Error("Orden de categoría inválido");
        }
        order = parsedOrder;
    }

    return Object.freeze({
        id,
        name: name.trim(),
        order
    });
}
