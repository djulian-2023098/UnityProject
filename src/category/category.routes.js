'use strict'

import { Router } from "express"
import { validateJwt, isAdmin } from "../../middlewares/validate.jwt.js"
import { addCategory, deleteCategory, getAllCategories, test, updateCategory } from "../category/category.controller.js"

const api = Router()

api.get('/test', test)

//EVERYONE
api.get('/get', [validateJwt], getAllCategories)

//JUST THE ADMIN
api.post('/add', [validateJwt, isAdmin], addCategory)
api.put('/update/:id', [validateJwt, isAdmin], updateCategory)
api.delete('/delete/:id', [validateJwt, isAdmin], deleteCategory)

export default api