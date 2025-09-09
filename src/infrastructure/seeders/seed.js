
import { logCyan } from "../../shared/log_custom.js";
import { Models, sequelize, syncDb } from "../db/sequelize.js";

async function seedAll({ reset = false } = {}) {

    if (reset) {
        console.log("recreando todas las tablas (force:true)");
        await syncDb({ force: true });
    } else {
        console.log(" ajustando tablas (alter:true)");
        await syncDb({ alter: true });
    }

    const { DeliveryType, Status, Category } = Models;


    await DeliveryType.bulkCreate(
        [
            { id: 1, name: "Delivery" },
            { id: 2, name: "Take away" },
            { id: 3, name: "Dine in" },
        ],
        { ignoreDuplicates: true }
    );

    await Status.bulkCreate(
        [
            { id: 1, name: "Pending" },
            { id: 2, name: "In progress" },
            { id: 3, name: "Ready" },
            { id: 4, name: "Delivery" },
            { id: 5, name: "Closed" },
        ],
        { ignoreDuplicates: true }
    );

    await Category.bulkCreate(
        [
            { id: 1, name: "Entradas", description: "Pequeñas porciones para abrir el apetito antes del plato principal.", order: 1 },
            { id: 2, name: "Ensaladas", description: "Opciones frescas y livianas, ideales como acompañamiento o plato principal.", order: 2 },
            { id: 3, name: "Minutas", description: "Platos rápidos y clásicos de bodegón: milanesas, tortillas, revueltos.", order: 3 },
            { id: 4, name: "Pastas", description: "Variedad de pastas caseras y salsas tradicionales.", order: 4 },
            { id: 5, name: "Parrilla", description: "Cortes de carne asados a la parrilla, servidos con guarniciones.", order: 5 },
            { id: 6, name: "Pizzas", description: "Pizzas artesanales con masa casera y variedad de ingredientes.", order: 7 },
            { id: 7, name: "Sandwiches", description: "Sandwiches y lomitos completos preparados al momento.", order: 6 },
            { id: 8, name: "Bebidas", description: "Gaseosas, jugos, aguas y opciones sin alcohol.", order: 8 },
            { id: 9, name: "Cerveza Artesanal", description: "Cervezas de producción artesanal, rubias, rojas y negras.", order: 9 },
            { id: 10, name: "Postres", description: "Clásicos dulces caseros para cerrar la comida.", order: 10 },
        ],
        { ignoreDuplicates: true }
    );

    logCyan("Precarga completa (DeliveryType, Status, Category).");
    await sequelize.close();
}

const reset = String(process.env.RESET || "false").toLowerCase() === "true";
seedAll({ reset }).catch((e) => {
    logCyan("Error en seed:", e);
    process.exit(1);
});
