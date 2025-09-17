// src/application/catalog/listStatuses.query.js

/**
 * Use case: listar Status
 * Depende de: statusQuery.findAll(): Promise<Array<{id,name}>>
 */
export function makeListStatuses({ statusQuery }) {
    return async function listStatuses() {
        const rows = await statusQuery.findAll();
        // Normalizamos la salida
        return rows.map(s => ({ id: s.id, name: s.name }));
    };
}

export default makeListStatuses;
