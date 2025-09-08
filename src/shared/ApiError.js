import Status from "./status.js";

export class ApiError extends Error {
    constructor({ message, status = Status.internalServerError, stack }) {
        super(message);

        this.title = "ApiError";
        this.status = status;

        // Si viene un stack externo, lo usamos
        if (stack) {
            this.stack = stack;
        } else {
            // Si no, dejamos que el Error nativo lo genere
            Error.captureStackTrace?.(this, ApiError);
        }
    }

    toJSON() {
        return {
            message: this.message ?? "Error",
            status: this.status,
            stack: this.stack // 👈 aquí lo incluyes en la respuesta
        };
    }
}
