export default function makeDish({ id = null, name, description = '', price, available = true, categoryId, imageUrl = null, createDate = null, updateDate = null }) {

    // ver de migrar verificacion 
    if (!name || typeof name !== 'string') throw new Error('Nombre inválido');
    if (price == null || isNaN(Number(price)) || Number(price) < 0) throw new Error('Precio inválido');


    if (!categoryId) throw new Error('categoryId requerido');
    return Object.freeze({
        id, name: name.trim(), description,
        price: Number(price), available: !!available,
        categoryId, imageUrl, createDate, updateDate
    });
}
