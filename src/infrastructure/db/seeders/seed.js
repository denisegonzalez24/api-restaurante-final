import "dotenv/config";
import { initDb, models } from "../db/sequelize.js";

(async function run() {
    await initDb();
    const { Category } = models;

    if (await Category.count() === 0) {
        await Category.bulkCreate([
            { id: 1, name: "Entradas", description: "Pequeñas porciones...", order: 1 },
            { id: 2, name: "Ensaladas", description: "Opciones frescas...", order: 2 },
            { id: 3, name: "Minutas", description: "Platos rápidos...", order: 3 }
            // agrega el resto de categorías de tu consigna si querés
        ]);
    }
    console.log("Seed OK");
    process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
