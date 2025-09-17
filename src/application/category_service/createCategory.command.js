export function makeCreateCategory({ categoryQueryRepo, categoryCommandRepo }) {
    return async function createCategory(body = {}) {
        // --- Normalización ---
        const name =
            typeof body.name === "string" ? body.name.trim() : "";
        const description =
            body.description === undefined || body.description === null
                ? null
                : String(body.description);
        const rawOrder = body.order ?? 0;
        const order =
            rawOrder === "" ? 0 : Number.isInteger(rawOrder) ? rawOrder : parseInt(rawOrder, 10);

        // --- Validaciones ---
        if (!name) throw withStatus(new Error("El nombre de la categoría es obligatorio"), 400);
        if (name.length > 100)
            throw withStatus(new Error("El nombre no puede superar 100 caracteres"), 400);

        if (description !== null && typeof description !== "string")
            throw withStatus(new Error("La descripción debe ser texto o null"), 400);
        if (description && description.length > 500)
            throw withStatus(new Error("La descripción no puede superar 500 caracteres"), 400);

        if (!Number.isInteger(order) || order < 0)
            throw withStatus(new Error("El campo order debe ser un entero >= 0"), 400);

        // --- Unicidad por nombre (pre-chequeo) ---
        let exists = false;
        if (typeof categoryQueryRepo?.findByName === "function") {
            exists = !!(await categoryQueryRepo.findByName(name));
        } else if (typeof categoryQueryRepo?.existsByName === "function") {
            exists = !!(await categoryQueryRepo.existsByName(name));
        }
        if (exists) {
            throw withStatus(new Error("Ya existe una categoría con ese nombre"), 409);
        }

        // --- Crear ---
        const created = await categoryCommandRepo.create({
            name,
            description,
            order,
        });

        // --- Respuesta canónica ---
        return {
            id: created.id,
            name: created.name,
            description: created.description ?? null,
            order: Number.isInteger(created.order) ? created.order : order,
        };
    };
}

function withStatus(error, status) {
    error.status = status;
    return error;
}