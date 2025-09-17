/**
 * También recibe funciones (use cases) en lugar de repos:
 * {
 *   listCategories,     // () => Promise<Category[]>
 *   listDeliveryTypes,  // () => Promise<DeliveryType[]>
 *   listStatuses,       // () => Promise<Status[]>
 * }
 *
 * Mantengo los mismos nombres de handlers para que no cambies tus rutas:
 *   getCategories, getDeliveryTypes, getStatuses
 */
export function makeCatalogController({ listCategories, listDeliveryTypes, listStatuses }) {
    return {
        getCategories: async (_req, res, next) => {
            try { res.json(await listCategories()); }
            catch (e) { next(e); }
        },
        getDeliveryTypes: async (_req, res, next) => {
            try { res.json(await listDeliveryTypes()); }
            catch (e) { next(e); }
        },
        getStatuses: async (_req, res, next) => {
            try { res.json(await listStatuses()); }
            catch (e) { next(e); }
        },
    };
}
