
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
export default makeCatalogController;
