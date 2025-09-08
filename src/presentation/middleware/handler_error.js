import { ApiError } from "../../shared/ApiError.js";
import Status from "../../shared/status.js";

export function errorHandler(err, req, res, next) {
    // Sequelize unique -> 409
    if (err?.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Ya existe un plato con ese nombre' });
    }
    // Errores de dominio
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message ?? null });
    }
    // Fallback
    console.error(err);
    return res.status(500).json({ message: 'Error interno' });
}


export function notFoundHandler(req, res, next) {
    res.status(Status.notFound).json({ message: `Route ${req.originalUrl} not found` });
}


