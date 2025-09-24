import { assertDeliveryTypeRepoQuery } from "../../domain/ports/deliveryTypeRepoQuery.port.js";

export function makeListDeliveryTypes({ deliveryTypeQueryRepo }) {
    const repo = assertDeliveryTypeRepoQuery(deliveryTypeQueryRepo);
    return async function listDeliveryTypes() {
        return repo.findAll();
    };
}
