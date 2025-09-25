
export function createOrderToCommand(dto = {}) {
    return {
        deliveryTypeId: dto?.delivery?.id ?? dto?.deliveryTypeId ?? null,
        deliveryTo: dto?.delivery?.to ?? dto?.deliveryTo ?? null,
        notes: dto?.notes ?? null,
        items: Array.isArray(dto.items) ? dto.items.map(it => ({
            dishId: it.dishId ?? it.id,
            quantity: Number(it.quantity || 1),
            notes: it?.notes ?? null,
        })) : []
    };
}
