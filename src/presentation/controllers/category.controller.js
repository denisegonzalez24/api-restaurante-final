import Status from "../../shared/status.js";


export function makeCategoryController({
    listCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}) {
    return {
        list: async (_req, res, next) => {
            try {
                const data = await listCategories();
                res.status(Status.ok).json(data);
            } catch (e) { next(e); }
        },

        getById: async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const data = await getCategoryById(id);
                if (!data) return res.status(Status.notFound).json({ message: "Categoría no encontrada" });
                res.status(Status.ok).json(data);
            } catch (e) { next(e); }
        },

        create: async (req, res, next) => {
            try {
                const data = await createCategory(req.body);
                res.status(Status.created).json(data);
            } catch (e) { next(e); }
        },

        update: async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const data = await updateCategory(id, req.body);
                res.status(Status.ok).json(data);
            } catch (e) { next(e); }
        },

        remove: async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                await deleteCategory(id);
                res.status(Status.noContent).send();
            } catch (e) { next(e); }
        },
    };
}
