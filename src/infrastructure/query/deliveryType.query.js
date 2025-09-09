export function deliveryTypeQueryRepository({ models }) {
    const { DeliveryType } = models;
    return {
        async findById(id) {
            const row = await DeliveryType.findOne({ where: { id } });
            return row ? row.get() : null;
        },
        async findAll() {
            const rows = await DeliveryType.findAll({ order: [["id", "ASC"]] });
            return rows.map(r => r.get());
        },
    };
}
