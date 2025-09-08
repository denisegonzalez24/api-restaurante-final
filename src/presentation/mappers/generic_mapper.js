export function toGenericResponse(modelOrPlain) {
    if (!modelOrPlain) return null;
    return {
        id: Number(modelOrPlain.id),
        name: modelOrPlain.name ?? null,
    };
}