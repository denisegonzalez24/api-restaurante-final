

export function makeListOrders({ orderQueryRepo }) {
    return async function listOrders({ from, to, status } = {}) {

        if (from && isNaN(new Date(from).getTime())) {
            throw new ApiError({ message: "Parámetros de búsqueda inválidos: 'from'", status: Status.badRequest });
        }
        if (to && isNaN(new Date(to).getTime())) {
            throw new ApiError({ message: "Parámetros de búsqueda inválidos: 'to'", status: Status.badRequest });
        }
        if (from && to && new Date(from) > new Date(to)) {
            throw new ApiError({ message: "Rango de fechas inválido", status: Status.badRequest });
        }

        return orderQueryRepo.findAll({ from, to, status });
    };
}
