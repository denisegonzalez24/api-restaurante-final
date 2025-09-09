export function makeOrderController({ orderQueryRepo, orderCommandRepo }) {
    return {
        create: async (req, res, next) => {
            try {
                const out = await orderCommandRepo.create(req.body || {});
                // devolvemos el detalle completo
                const full = await orderQueryRepo.findById(out.id);
                res.status(201).json(full);
            } catch (e) { next(e); }
        },
        list: async (req, res, next) => {
            try {
                const { date, status } = req.query || {};
                res.json(await orderQueryRepo.findAll({ date, status }));
            } catch (e) { next(e); }
        },
        getById: async (req, res, next) => {
            try {
                const row = await orderQueryRepo.findById(req.params.id);
                if (!row) return res.status(404).json({ message: "Orden no encontrada" });
                res.json(row);
            } catch (e) { next(e); }
        },
        addItem: async (req, res, next) => {
            try {
                await orderCommandRepo.addItem(req.params.id, req.body || {});
                const full = await orderQueryRepo.findById(req.params.id);
                res.json(full);
            } catch (e) { next(e); }
        },
        removeItem: async (req, res, next) => {
            try {
                // necesito el orderId para responder la orden actualizada
                const item = await orderQueryRepo.models.OrderItem.findByPk(req.params.itemId);
                if (!item) return res.status(404).json({ message: "Item no encontrado" });
                await orderCommandRepo.removeItem(item.id);
                const full = await orderQueryRepo.findById(item.orderId);
                res.json(full);
            } catch (e) { next(e); }
        },
        updateItemStatus: async (req, res, next) => {
            try {
                const { status } = req.body || {};
                const item = await orderQueryRepo.models.OrderItem.findByPk(req.params.itemId);
                if (!item) return res.status(404).json({ message: "Item no encontrado" });
                await orderCommandRepo.updateItemStatus(item.id, status);
                const full = await orderQueryRepo.findById(item.orderId);
                res.json(full);
            } catch (e) { next(e); }
        },
    };
}
