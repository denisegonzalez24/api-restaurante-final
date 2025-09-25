export const DeliveryTypeRepoQueryMethods = Object.freeze([
    "findAll",
    "findById"
]);

export function assertDeliveryTypeRepoQuery(repo) {
    for (const m of DeliveryTypeRepoQueryMethods) {
        if (typeof repo[m] !== "function") {
            throw new Error(`DeliveryTypeRepoQuery inválido: falta "${m}"`);
        }
    }
    return repo;
}

//donde usarlok??? no se

//to do