export function normalizeOrderBody(body = {}) {
    const deliveryTypeId = body.deliveryTypeId ?? body.delivery?.id ?? null;
    const deliveryTo = body.deliveryTo ?? body.delivery?.to ?? null;

    const items = Array.isArray(body.items) ? body.items.map(it => ({
        dishId: it.dishId ?? it.id,
        quantity: Number(it.quantity || 1),
        notes: it.notes ?? null,
    })) : [];

    return {
        deliveryTypeId,
        deliveryTo,
        notes: body.notes ?? null,
        items,
    };
}


export function createOrderToCommand(dto) {

    const items = Array.isArray(dto?.items) ? dto.items.map(it => ({
        dishId: it.id,
        quantity: Number(it.quantity || 1),
        notes: it?.notes ?? null,
    })) : [];

    return {
        items,
        deliveryTypeId: dto?.delivery?.id ?? null,
        deliveryTo: dto?.delivery?.to ?? null,
        notes: dto?.notes ?? null,
    };
}
