import { body } from "express-validator";
import { validateErrors } from "./validate.errors.js";
import { existEmail, existUsername } from "../utils/db.validators.js";

//Arreglo de validación
export const registerValidation = [
    body('name','Name can not be empty')
    .notEmpty(),
    body('surname','Surname can not be empty')
    .notEmpty(),
    body('email','Email can not be empty')
    .notEmpty()
    .isEmail()
    .custom(existEmail),
    body('username', 'Username can not be empty')
    .notEmpty()
    .toLowerCase()
    .custom(existUsername),
    body('password', 'password can not be empty')
    .notEmpty()
    .isStrongPassword().withMessage('password must be strong')
    .isLength({min: 8}),
    body('phone','Phone can not be empty')
    .notEmpty()
    .isMobilePhone(),
    validateErrors
]