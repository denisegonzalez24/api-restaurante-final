import { Router } from "express";

export function makeCategoryRoutes(controller) {
    const r = Router();

    r.get("/", controller.list);
    r.get("/:id", controller.getById);
    r.post("/", controller.create);
    r.put("/:id", controller.update);
    r.delete("/:id", controller.remove);

    return r;
}
