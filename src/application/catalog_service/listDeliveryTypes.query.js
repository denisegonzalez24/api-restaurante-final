// src/application/catalog/listDeliveryTypes.query.js

/**
 * Use case: listar DeliveryTypes
 * Depende de un query con: deliveryTypeQuery.findAll(): Promise<Array<{id,name}>>
 */
export function makeListDeliveryTypes({ deliveryTypeQuery }) {
    return async function listDeliveryTypes() {
        const rows = await deliveryTypeQuery.findAll();
        // Normalizamos la salida por si el repo trae extras
        return rows.map(dt => ({ id: dt.id, name: dt.name }));
    };
}

export default makeListDeliveryTypes;
