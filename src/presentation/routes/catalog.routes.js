import { Router } from "express";
export function makeCatalogRoutes(controller) {
    const r = Router();
    r.get("/Category", controller.getCategories);
    r.get("/DeliveryType", controller.getDeliveryTypes);
    r.get("/Status", controller.getStatuses);
    return r;
}
export default makeCatalogRoutes;
