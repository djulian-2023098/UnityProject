import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, searchProduct, test, updateProduct } from "./product.controller.js";
import { isAdmin, isClient, validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.get('/test', test)
api.post('/add', [validateJwt, isAdmin],addProduct)
api.get('/getAll', [validateJwt],getAllProducts)
api.get('/search/:id', [validateJwt],searchProduct)
api.put('/update/:id', [validateJwt, isAdmin],updateProduct)
api.delete('/delete/:id',[validateJwt, isAdmin],deleteProduct)

export default api