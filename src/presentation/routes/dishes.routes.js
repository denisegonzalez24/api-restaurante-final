import { Router } from 'express';

export default function makeDishesRoutes(controller) {
    const r = Router();

    r.post('/', controller.create);
    r.get('/', controller.list);
    r.put('/:id', controller.update);

    return r;
}
