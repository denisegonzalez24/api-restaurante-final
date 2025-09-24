import { Router } from "express";
export function makeOrderRoutes(controller) {
    const r = Router();
    r.post("/", controller.create);
    r.get("/", controller.list);
    r.get("/:id", controller.getById);
    r.post("/:id/items", controller.addItem);
    r.delete("/item/:itemId", controller.removeItem);
    r.put("/item/:itemId/status", controller.updateItemStatus);
    r.put("/:orderId/items/:itemId/status", controller.updateItemStatus);
    r.put("/:orderId/items/:itemId/quantity", controller.updateItemQuantity);
    return r;
}
