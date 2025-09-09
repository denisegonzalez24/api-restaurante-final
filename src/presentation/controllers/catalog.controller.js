export function makeCatalogController({ categoryQueryRepo, deliveryTypeQueryRepo, statusQueryRepo }) {
    return {
        getCategories: async (_req, res, next) => {
            try { res.json(await categoryQueryRepo.findAll()); }
            catch (e) { next(e); }
        },
        getDeliveryTypes: async (_req, res, next) => {
            try { res.json(await deliveryTypeQueryRepo.findAll()); }
            catch (e) { next(e); }
        },
        getStatuses: async (_req, res, next) => {
            try { res.json(await statusQueryRepo.findAll()); }
            catch (e) { next(e); }
        },
    };
}
