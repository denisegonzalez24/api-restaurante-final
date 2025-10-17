
import { logCyan } from "../../shared/log_custom.js";
import { models, sequelize, syncDb } from "../db/sequelize.js";

async function seedAll({ reset = false } = {}) {

    if (reset) {
        console.log("recreando todas las tablas (force:true)");
        await syncDb({ force: true });
    } else {
        console.log(" ajustando tablas (alter:true)");
        await syncDb({ alter: true });
    }

    const { DeliveryType, Status, Category, Dish } = models;


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

    await Dish.bulkCreate(
        [

            {
                name: "Empanadas salteñas",
                description: "De carne cortada a cuchillo, horneadas.",
                price: 1500.00,
                available: true,
                imageUrl: "https://www.clarin.com/img/2025/08/25/GfUT32woa_1256x620__2.jpg#1756127409321",
                categoryId: 1,
            },
            {
                name: "Bruschetta caprese",
                description: "Tomate, albahaca y mozzarella sobre pan tostado.",
                price: 2600.00,
                available: true,
                imageUrl: "https://www.oleariaclemente.it/wp-content/uploads/2015/06/bruschetta-caprese.jpg",
                categoryId: 1,
            },
            {
                name: "Ensalada mixta",
                description: "Lechuga, tomate, cebolla y zanahoria.",
                price: 2500.00,
                available: true,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Ensalada_mixta.jpghttps://resizer.glanacion.com/resizer/v2/ensalada-J67H4WJVIFC7NJVTGJWWANAT5Q.jpg?auth=45eb33da37ee39cdd802e4a3026770322db978eddf1fa032c45d6cd8c6d63664&width=420&height=280&quality=70&smart=true",
                categoryId: 2,
            },

            {
                name: "Milanesa napolitana",
                description: "Con salsa de tomate, jamón y mozzarella.",
                price: 6200.00,
                available: true,
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhhY6YdrvvVZZWdD8yQv48FnMfhKmhTDb0fA&s",
                categoryId: 3,
            },
            {
                name: "Tortilla de papas",
                description: "Jugosa, con cebolla.",
                price: 3900.00,
                available: true,
                imageUrl: "https://resizer.glanacion.com/resizer/v2/tortilla-de-papas-con-EPMZH233TBBEBETIIAYLJQ57JU.jpg?auth=c7d754a1ca578aa0c4a1d4c9a53b7e8cd661bf9be7142e7d1bde46df2d8863df&width=420&height=280&quality=70&smart=true",
                categoryId: 3,
            },
            {
                name: "Revuelto gramajo",
                description: "Papas pay, huevo y jamón salteados.",
                price: 4500.00,
                available: true,
                imageUrl: "https://www.cucinare.tv/wp-content/uploads/2023/03/Gramajo-Cucco.jpg",
                categoryId: 3,
            },

            {
                name: "Sorrentinos de jamón y queso",
                description: "Caseros, con salsa fileto.",
                price: 5800.00,
                available: true,
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfmcpxHV2JK2l5krjy-1fIDUjRRX_t2WqC-g&s",
                categoryId: 4,
            },
            {
                name: "Ñoquis de papa",
                description: "Con salsa cuatro quesos.",
                price: 5400.00,
                available: true,
                imageUrl: "https://cdn.elcocinerocasero.com/imagen/receta/1000/2016-05-26-18-07-22/noquis-con-salsa-bolonesa.jpeg",
                categoryId: 4,
            },


            {
                name: "Asado de tira",
                description: "Corte vacuno a la parrilla.",
                price: 9900.00,
                available: true,
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Two_pieces_of_grilled_short_ribs_served_on_a_plate%2C_2007.jpg",
                categoryId: 5,
            },
            {
                name: "Vacío",
                description: "A punto, con chimichurri.",
                price: 10500.00,
                available: true,
                imageUrl: "https://www.clarin.com/img/2022/03/07/bLQTweKXI_1200x630__1.jpg",
                categoryId: 5,
            },
            {
                name: "Chorizo criollo",
                description: "Clásico parrillero.",
                price: 3000.00,
                available: true,
                imageUrl: "https://airescriollos.com.ar/wp-content/uploads/2020/10/Chorizo.jpg",
                categoryId: 5,
            },


            {
                name: "Muzzarella",
                description: "Salsa de tomate, mozzarella y orégano.",
                price: 5200.00,
                available: true,
                imageUrl: "https://acdn-us.mitiendanube.com/stores/001/664/252/products/4e475ddf-2c43-4d47-b69c-990a92e91029-26f258f7fdb6a2b9fb16276674103675-640-0.jpeg",
                categoryId: 6,
            },
            {
                name: "Fugazzeta rellena",
                description: "Cebolla y doble queso.",
                price: 6000.00,
                available: true,
                imageUrl: "https://img-global.cpcdn.com/recipes/6bc24e2204fc621f/300x426cq80/pizza-fugazzeta-rellena-foto-principal.webp",
                categoryId: 6,
            },



            {
                name: "Lomito completo",
                description: "Lomo, lechuga, tomate, huevo y jamón.",
                price: 6200.00,
                available: true,
                imageUrl: "https://resizer.glanacion.com/resizer/v2/sandwich-de-GYW4JAP2DJDBBL7OYTGBDKEAZQ.jpg?auth=4c4ac6e245b5caaf4611ff2e607ac36c83a27ccffd2948d230164808f6ba2760&width=880&height=586&quality=70&smart=true",
                categoryId: 7,
            },
            {
                name: "Hamburguesa clásica",
                description: "Carne 120g, queso, lechuga y tomate.",
                price: 4800.00,
                available: true,
                imageUrl: "https://www.recetasnestle.com.ec/sites/default/files/srh_recipes/4e4293857c03d819e4ae51de1e86d66a.jpg",
                categoryId: 7,
            },

            // 8) BEBIDAS (8)
            {
                name: "Agua mineral sin gas 500ml",
                description: "Botella individual.",
                price: 1200.00,
                available: true,
                imageUrl: "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040004_f.jpg",
                categoryId: 8,
            },
            {
                name: "Gaseosa cola 500ml",
                description: "Bien fría.",
                price: 1600.00,
                available: true,
                imageUrl: "https://ardiaprod.vtexassets.com/arquivos/ids/358630/Gaseosa-CocaCola-Sabor-Original-500-Ml-_1.jpg?v=638951680514230000",
                categoryId: 8,
            },

            {
                name: "IPA pint",
                description: "Amarga y aromática.",
                price: 2800.00,
                available: true,
                imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRraFJMBewfPeaCIDHa1O9ga0C149cCtbIjEQ&s",
                categoryId: 9,
            },
            {
                name: "Flan casero",
                description: "Con dulce de leche y crema.",
                price: 2800.00,
                available: true,
                imageUrl: "https://vinomanos.com/wp-content/uploads/2020/04/Flan-casero-argentino.jpg",
                categoryId: 10,
            },
            {
                name: "Helado 2 bochas",
                description: "Sabores a elección.",
                price: 2600.00,
                available: true,
                imageUrl: "https://images.cookforyourlife.org/wp-content/uploads/2020/06/Chocolate-Whipped-Ice-Cream-shutterstock_1010248351.jpg",
                categoryId: 10,
            },
        ],
        { ignoreDuplicates: true }
    );

    logCyan("Precarga completa (DeliveryType, Status, Category, Dish).");
    await sequelize.close();
}


const reset = String(process.env.RESET || "false").toLowerCase() === "true";
seedAll({ reset }).catch((e) => {
    console.log("Error en seed:", e);
    process.exit(1);
});
