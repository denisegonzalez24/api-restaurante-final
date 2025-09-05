import { Router } from 'express';

export default function makeDishesRoutes(controller) {
    const route = Router();

    route.post('/', controller.create);
    route.get('/', controller.list);
    route.put('/:id', controller.update);

    return route;
}
