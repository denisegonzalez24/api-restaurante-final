import { assertStatusRepoQuery } from "../../domain/ports/statusRepoQuery.port.js";

export function makeListStatuses({ statusQueryRepo }) {
    const repo = assertStatusRepoQuery(statusQueryRepo);
    return async function listStatuses() {
        return repo.findAll();
    };
}
