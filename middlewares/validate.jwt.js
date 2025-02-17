'use strict'

import jwt from "jsonwebtoken"
import User from "../src/user/user.model.js"
import { findUser } from "../utils/db.validators.js"

export const validateJwt = async(req, res, next)=>{
    try {
        let secretKey = process.env.SECRET_KEY
        
        let {authorization} = req.headers

        if(!authorization) return res.status(401).send({message: 'Unauthorized'})

        let { uid } = jwt.verify(authorization, secretKey)
        
        const validateUser = await User.findOne({_id: uid})
        
        if(!validateUser) return res.status(404).send(
            {
                succes: false,
                message: 'User not found - unauthorized'
            }
        )
        req.user = validateUser
        next()
    } catch (error) {
        console.error(error)
        return res.status(401).send({message: 'Invalid Credentials'})
    }
}

export const isAdmin = async(req,res,next)=>{
    try {
        const {user} = req
        if(!user || user.role !== 'ADMIN')return res.status(403).send(
            {
                success: false,
                message: `You don't have acces | username ${user.username}`
            }
        )
        next()
    } catch (err) {
        console.error(err)
        return res.status(403).send(
            {
                success: false,
                message: 'Error with authorization'
            }
        )
    }
}

export const isClient = async(req, res, next)=>{
    try {
        let { role, username } = req.user
        if(!role || role !== 'CLIENT') return res.status(403).send(
            {
                succes: false,
                message: `You dont have access | username ${username}`
            }
        )
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role'})
    }
}