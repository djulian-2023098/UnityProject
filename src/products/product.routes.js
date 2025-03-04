import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, searchProduct, test, updateProduct } from "./product.controller.js";

const api = Router()

api.get('/test', test)
api.post('/add', addProduct)
api.get('/getAll', getAllProducts)
api.get('/search/:id', searchProduct)
api.put('/update/:id', updateProduct)
api.delete('/delete/:id', deleteProduct)

export default api