export default function makeDishesController({ dishesService }) {
    return {
        create: async (req, res) => {
            try {
                const dish = await dishesService.create(req.body);
                res.status(201).json(dish);
            } catch (e) {
                if (e.code === 'DUPLICATE') return res.status(409).json({ error: e.message });
                res.status(400).json({ error: e.message });
            }
        },
        list: async (req, res) => {
            try {
                const dishes = await dishesService.list(req.query);
                res.json(dishes);
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        },
        update: async (req, res) => {
            try {
                const dish = await dishesService.update(req.params.id, req.body);
                if (!dish) return res.status(404).json({ message: 'Not found' });
                res.json(dish);
            } catch (e) {
                res.status(400).json({ error: e.message });
            }
        }
    };
}
