import { Router } from "express";
export function makeOrderRoutes(controller) {
    const r = Router();
    r.post("/", controller.create);
    r.get("/", controller.list);
    r.put("/", controller.update);
    r.get("/:id", controller.getById);
    r.put("/:id/item/:itemId", controller.updateItemStatus);
    r.post("/:id/items", controller.addItem);
    r.put("/:orderId/items/:itemId/status", controller.updateItemStatus);
    return r;
}
