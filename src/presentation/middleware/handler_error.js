import { ApiError } from "../../shared/ApiError.js";
import { logCyan } from "../../shared/log_custom.js";
import Status from "../../shared/status.js";

export function errorHandler(err, req, res, next) {
    let ex;
    if (err?.name === 'SequelizeUniqueConstraintError') {
        return res.status(Status.conflict).json({ message: 'Ya existe un plato con ese nombre' });
    }

    if (err instanceof ApiError) {
        ex = err;
    } else {
        ex = new ApiError({ message: err?.message, status: err?.status || Status.internalServerError, stack: err?.stack });
    }

    logCyan(JSON.stringify(ex));
    return res.status(Status.internalServerError).json(ex.toJSON());
}


export function notFoundHandler(req, res, next) {
    res.status(Status.notFound).json({ message: `Route ${req.originalUrl} not found` });
}


