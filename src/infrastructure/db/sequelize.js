import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'data.sqlite'),
    logging: false
});

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    order: { type: DataTypes.INTEGER }
}, { tableName: 'categories', timestamps: false });

const Dish = sequelize.define('Dish', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    imageUrl: { type: DataTypes.STRING },
    createDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updateDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'dishes', timestamps: false });

Dish.belongsTo(Category, { foreignKey: 'categoryId' });
Category.hasMany(Dish, { foreignKey: 'categoryId' });

async function initDb() {
    await sequelize.authenticate();
    await sequelize.sync(); // code-first
}

export default { sequelize, models: { Category, Dish }, initDb };
