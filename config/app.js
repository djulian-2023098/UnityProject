'use strict'

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors';
import authRoutes from '../src/auth/auth.routes.js'
import { limiter } from "../middlewares/rate.limits.js";
import categoryRoutes from "../src/category/category.routes.js"
import userRoutes from "../src/user/user.routes.js"
import productRoutes from '../src/products/product.routes.js'
import cartRoutes from '../src/cart/cart.routes.js'

const configs = (app)=>{
    app.use(express.json())
    app.use(express.urlencoded({extends: false}))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/category',categoryRoutes)
    app.use('/user', userRoutes)
    app.use('/product', productRoutes)
    app.use('/cart', cartRoutes)
}

export const initServer = ()=>{
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    } catch (error) {
        console.error('Server init failed',error)
    }
}