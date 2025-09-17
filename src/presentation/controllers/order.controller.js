export function makeOrderController({ orderQueryRepo, orderCommandRepo }) {
    return {
        create: async (req, res, next) => {
            try {
                const out = await orderCommandRepo.create(req.body || {});
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
                const full = await orderQueryRepo.findById(req.params.id);
                if (!full) return res.status(404).json({ message: "Orden no encontrada" });
                res.json(full);
            } catch (e) { next(e); }
        },

        addItem: async (req, res, next) => {
            try {
                const { dishId, quantity, notes } = req.body || {};
                await orderCommandRepo.addItem(req.params.id, { dishId, quantity, notes });
                const full = await orderQueryRepo.findById(req.params.id);
                res.status(201).json(full);
            } catch (e) { next(e); }
        },

        removeItem: async (req, res, next) => {
            try {
                await orderCommandRepo.removeItem(req.params.itemId);
                res.status(204).send();
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
