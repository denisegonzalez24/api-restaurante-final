import { ApiError } from "../../shared/ApiError.js";
import { logCyan } from "../../shared/log_custom.js";
import Status from "../../shared/status.js";

export function errorHandler(err, req, res, next) {
    let ex;
    if (err?.name === 'SequelizeUniqueConstraintError') {
        return res.status(Status.conflict).json({ message: 'Ya existe un plato con ese nombre' });
    }
    if (err?.name === 'SequelizeValidationError') {
        return res.status(Status.badRequest).json({ message: err?.errors?.[0]?.message || 'Datos de entrada inválidos' }); // 400
    }
    if (err?.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(Status.badRequest).json({ message: 'La categoría no existe' }); // 400
    }

    if (err instanceof ApiError) {
        ex = err;
    } else {
        ex = new ApiError({ message: err?.message, status: err?.status || Status.internalServerError, stack: err?.stack });
    }

    logCyan(JSON.stringify({ message: ex.message, status: ex.status, stack: err?.stack }));
    return res.status(ex.status ?? Status.internalServerError).json({ message: ex.message });
}


export function notFoundHandler(req, res, next) {
    res.status(Status.notFound).json({ message: `Route ${req.originalUrl} not found` });
}


