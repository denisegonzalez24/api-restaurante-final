import { CustomException } from "../../shared/custom_exception.js";
import Status from "../../shared/status.js";


export function errorHandler(err, req, res, next) {
    if (err instanceof CustomException) {
        return res.status(err.status).json({ message: err.message });
    }

    if (err?.name === "SequelizeUniqueConstraintError") {
        return res.status(Status.conflict).json({ message: "Ya existe un registro con ese valor único" });
    }

    if (err?.name === "SequelizeValidationError") {
        return res.status(Status.badRequest).json({ message: err.message });
    }

    console.error("[UnhandledError]", err);
    return res.status(Status.internalServerError).json({ message: "Error interno" });
}

export function notFoundHandler(req, res, next) {
    res.status(Status.notFound).json({ message: `Route ${req.originalUrl} not found` });
}