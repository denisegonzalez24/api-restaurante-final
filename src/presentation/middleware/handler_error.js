import { ApiError } from "../../shared/ApiError.js";
import { ERR } from "../../shared/constants.js";
import { logCyan } from "../../shared/log_custom.js";
import Status from "../../shared/status.js";

export function errorHandler(err, req, res, next) {
    let ex;
    if (err?.name === 'SequelizeUniqueConstraintError') {
        return res.status(Status.conflict).json({ message: ERR.DUPLICATE_DISH_NAME });
    }
    if (err?.name === 'SequelizeValidationError') {
        return res.status(Status.badRequest).json({ message: ERR.INVALID_INSERT });
    }
    if (err?.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(Status.badRequest).json({ message: ERR.CATEGORY_NOT_FOUND });
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


