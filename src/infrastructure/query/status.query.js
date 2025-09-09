export function statusQueryRepository({ models }) {
    const { Status } = models;
    return {
        async findById(id) {
            const row = await Status.findOne({ where: { id } });
            return row ? row.get() : null;
        },
        async findByName(name) {
            const row = await Status.findOne({ where: { name } });
            return row ? row.get() : null;
        },
        async findAll() {
            const rows = await Status.findAll({ order: [["id", "ASC"]] });
            return rows.map(r => r.get());
        },
    };
}