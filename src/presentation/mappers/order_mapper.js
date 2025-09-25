import { mapDishShort } from "./dish.mapper.js";

function mapItemResponse(item) {
    return {
        id: Number(item.id),
        quantity: Number(item.quantity),
        notes: item.notes ?? null,
        status: item.status ? { id: Number(item.status.id), name: item.status.name } : null,
        dish: mapDishShort(item.dish),
    };
}


export function toOrderDetailsResponse(order) {
    if (!order) return null;
    return {
        orderNumber: Number(order.id),
        totalAmount: Number(order.price),
        deliveryTo: order.deliveryTo ?? null,
        notes: order.notes ?? null,
        status: order.overallStatus ? {
            id: Number(order.overallStatus.id),
            name: order.overallStatus.name
        } : null,
        deliveryType: order.deliveryType ? {
            id: Number(order.deliveryType.id),
            name: order.deliveryType.name
        } : null,
        items: Array.isArray(order.items) ? order.items.map(mapItemResponse) : [],
        createdAt: order.createDate ?? null,
        updatedAt: order.updateDate ?? null,
    };
}

export function toOrderCreateResponse(order) {
    if (!order) return null;
    return {
        orderNumber: Number(order.id),
        totalAmount: Number(order.price),
        createdAt: order.createDate ?? null,
    };
}

export function toOrderDetailsResponseList(rows = []) {
    const arr =
        Array.isArray(rows) ? rows
            : (rows && Array.isArray(rows.rows)) ? rows.rows
                : rows ? [rows] : [];

    console.log(arr);

    return arr.map(r => ({
        orderNumber: Number(r.id),
        totalAmount: Number(r.price),
        deliveryTo: r.deliveryTo ?? null,
        notes: r.notes ?? null,
        status: r.overallStatus
            ? { id: Number(r.overallStatus.id), name: r.overallStatus.name }
            : null,
        deliveryType: r.deliveryType
            ? { id: Number(r.deliveryType.id), name: r.deliveryType.name }
            : null,
        items: undefined,
        createdAt: r.createDate ?? null,
        updatedAt: r.updateDate ?? null,
    }));
}

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
