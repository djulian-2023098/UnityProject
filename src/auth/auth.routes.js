import { Router } from "express";
import { login, register, test } from "./auth.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";
import { registerValidation } from "../../middlewares/validators.js";

const api = Router()

api.post(
    '/register',
    [
        registerValidation
    ],
    register
)

api.post('/login', login)
api.get('/test', validateJwt,test)

export default api