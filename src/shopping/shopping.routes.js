import { Router } from "express";
import { completePurchase } from "./shopping.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";

const api = Router()

api.post('/completePurcharse', validateJwt, completePurchase)

export default api