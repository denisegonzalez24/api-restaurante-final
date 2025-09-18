
export function makeListOrders({ orderQueryRepo }) {
    return async function listOrders({ date, status } = {}) {
        return orderQueryRepo.findAll({ date, status });
    };
}
