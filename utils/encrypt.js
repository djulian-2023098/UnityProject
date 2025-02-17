'use strict'

import { hash, verify } from "argon2"

export const encrypt = async (password)=>{
    try {
        return await hash(password)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkPassword = async(hash, password)=>{
    try {
        return await verify(hash,password)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkUpdate = (data, userId)=>{
    if(userId){
        if(
            Object.entries(data).length === 0 ||
            data.password  ||
            data.password == '' ||
            data.role ||
            data.role == ''
        ) return false
        return true
    }
}