import { Router } from "express";
import { completePurchase, getHistory } from "./shopping.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.post('/completePurcharse', validateJwt, completePurchase)
api.get('/history', validateJwt, getHistory)

export default api