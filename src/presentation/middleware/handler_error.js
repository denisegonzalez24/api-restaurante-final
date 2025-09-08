import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function errorHandler(err, req, res, next) {

    if (err?.name === 'SequelizeUniqueConstraintError') {
        return res.status(Status.conflict).json({ message: 'Ya existe un plato con ese nombre' });
    }

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message ?? null });
    }

    console.error(err);
    return res.status(Status.internalServerError).json({ message: 'Error interno' });
}


export function notFoundHandler(req, res, next) {
    res.status(Status.notFound).json({ message: `Route ${req.originalUrl} not found` });
}


