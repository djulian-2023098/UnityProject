import { Router } from "express";
import { addToCart, deleteCart, getCart, test, updateCart } from "./cart.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.get('/test', test)
api.post('/addCart', validateJwt,addToCart)
api.get('/getCart', validateJwt,getCart)
api.put('/update/:id', validateJwt, updateCart)
api.delete('/delete/:id', validateJwt, deleteCart)

export default api