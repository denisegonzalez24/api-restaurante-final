import { makeGetCategoryById } from './getCategoryById.query.js';

export const makeUpdateCategory = ({ categoryRepoQuery, categoryRepoCommand }) => async (id, dto) => {
    // reusar validaciones del create
    if (!dto || typeof dto !== 'object') { const e = new Error('Body inválido'); e.status = 400; throw e; }
    const payload = {
        name: dto.name,
        description: dto.description ?? null,
        order: dto.order ?? null,
    };
    // Validaciones
    if (!payload.name || !payload.name.trim()) { const e = new Error('El nombre de la categoría es obligatorio'); e.status = 400; throw e; }
    if (payload.name.length > 100) { const e = new Error('El nombre no puede superar 100 caracteres'); e.status = 400; throw e; }
    if (payload.description && payload.description.length > 500) { const e = new Error('La descripción no puede superar 500 caracteres'); e.status = 400; throw e; }
    if (payload.order != null && (!Number.isInteger(payload.order) || payload.order < 0)) { const e = new Error('El campo order debe ser un entero >= 0'); e.status = 400; throw e; }

    const exists = await categoryRepoQuery.existsById(id);
    if (!exists) { const e = new Error('Categoría no encontrada'); e.status = 404; throw e; }

    const dup = await categoryRepoQuery.existsByNameExcludingId(payload.name, id);
    if (dup) { const e = new Error('Ya existe una categoría con ese nombre'); e.status = 409; throw e; }

    const updated = await categoryRepoCommand.updateById(id, payload);
    return { id: updated.id, name: updated.name, description: updated.description, order: updated.order };
};
