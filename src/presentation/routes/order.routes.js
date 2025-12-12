import { Router } from "express";
export function makeOrderRoutes(controller) {
    const r = Router();
    r.post("/", controller.create);
    r.get("/", controller.list);
    r.patch("/", controller.update);
    r.get("/:id", controller.getById);
    r.patch("/:id/item/:itemId", controller.updateItemStatus);
    //este endpoint no esta en el openApi 
    // r.post("/:id/items", controller.addItem);
    return r;
}
