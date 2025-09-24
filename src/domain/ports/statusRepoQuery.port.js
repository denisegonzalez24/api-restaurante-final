export const StatusRepoQueryMethods = Object.freeze([
    "findAll",
    "findById"
]);

export function assertStatusRepoQuery(repo) {
    for (const m of StatusRepoQueryMethods) {
        if (typeof repo[m] !== "function") {
            throw new Error(`StatusRepoQuery inválido: falta "${m}"`);
        }
    }
    return repo;
}
