export function makeGetOrderById({ orderQueryRepo }) {
    return async function getOrderById(orderId) {
        return orderQueryRepo.findById(orderId);
    };
}
