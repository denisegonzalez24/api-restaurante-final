# Endpoints por módulo

##  DISH

### /api/v1/Dish
- POST → Crear plato 🟩     
- GET → Buscar platos 🟩

### /api/v1/Dish/{id}
- GET → Obtener plato por ID 🟩 (falta validacion si id no existe - error: "message": "Cannot read properties of null (reading 'category')"  )
- PUT → Actualizar plato 🟩
- DELTE → Eliminar plato 🟩 posibilidad de pasarlo a un soft delete 

---

## 🟩 CATEGORY

### /api/v1/Category
- OPTIONS → Obtener categorías 🟩

---

## 🟩 DELIVERY TYPE

### /api/v1/DeliveryType
- OPTIONS → Obtener tipos de entrega 🟩

---

## 🟩 STATUS

### /api/v1/Status
- OPTIONS → Obtener estados de órdenes 🟩

---

## 🟩 ORDER

### /api/v1/Order
- POST → Crear orden 🟩
- GET → Buscar órdenes 🟩
- PATCH → Actualizar orden 🟩

### /api/v1/Order/{id}
- GET → Obtener orden por número 
### /api/v1/Order/{id}/item/{itemId}
- PATCH → Actualizar estado de un ítem de orden 🟩

