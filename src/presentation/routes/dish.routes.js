import { Router } from "express";

export function makeDishRoutes(controller) {
    const r = Router();
    r.post("/", controller.create);            // POST /api/v1/Dish
    r.get("/", controller.list);               // GET  /api/v1/Dish
    r.put("/:id", controller.update);          // PUT  /api/v1/Dish/{id}
    return r;
}

