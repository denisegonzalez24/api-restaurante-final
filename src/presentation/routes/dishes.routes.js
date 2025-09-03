import { Router } from 'express';

export default function makeDishesRoutes(controller) {
    const r = Router();

    r.post('/', controller.create);       // crear
    r.get('/', controller.list);          // listar + filtros + orden
    r.put('/:id', controller.update);     // actualizar

    return r;
}
