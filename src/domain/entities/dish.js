export function makeDish({
    id = null,
    name, description = "",
    price, available = true,
    categoryId, imageUrl = null,
    createDate = null,
    updateDate = null }) {

    if (!name || typeof name !== "string") throw new Error("Nombre inválido");
    const p = Number(price);
    if (isNaN(p) || p <= 0) throw new Error("Precio inválido");
    if (!categoryId) throw new Error("categoryId requerido");

    return Object.freeze({
        id,
        name: name.trim(),
        description,
        price: p,
        available: !!available,
        categoryId,
        imageUrl,
        createDate,
        updateDate
    });
}
