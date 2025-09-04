import { CustomException } from "../../shared/custom_exception.js";
import Status from "../../shared/status.js";


export default function handleError(req, res, err) {
    let ex;

    if (err instanceof CustomException) {
        ex = err;
    } else {
        ex = new CustomException({
            title: 'Internal Server Error',
            message: err.message,
            stack: err.stack,
            status: Status.internalServerError
        });
    }

    return res.status(ex.status).json(ex.toJSON());
}