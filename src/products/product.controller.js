'use strict'

import Product from './product.model.js'

export const test = (req, res)=>{
    return res.send(`Product routes it's working`)
}


//ADD PRODUCT
export const addProduct = async(req,res)=>{
    try {
        let data = req.body

        let product = new Product(data)

        await product.save()

        return res.status(200).send({message:'Product added successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error adding a product'})
    }
}

//GET ALL PRODUCTS
export const getAllProducts = async(req, res)=>{
    try {
        const {sortBy, order, outOfStock, bestSellers} = req.query

        const filter = {}

        if(outOfStock === 'true'){
            filter.stock = 0
        }

        const sortField = bestSellers == 'true' ? 'sold' : sortBy || 'stock'
        const sortOrder = bestSellers === 'true' ? -1 : order === 'desc' ? -1: 1

        const products = await Product.find(filter).sort({[ sortField ]: sortOrder})

        if(!products) return res.status(404).send(
            {
                succes:false,
                message: 'Products not found'
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Products found: ',
                products
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).send({message: 'Error getting products'})
    }
}

//SEARCH PRODUCT
export const searchProduct = async (req,res)=>{
    try {
        let {id} = req.params
        let product = await Product.findById(id)

        if(!product) return res.status(404).send(
            {
                succes:false,
                message: 'Product not found'
            }
        )
        return res.send(
            {
                succes: true,
                message: 'Product found: ',
                product
            }
        )
    } catch (error) {
        console.log(error)
    }
}


export const updateProduct = async(req,res)=>{
    try {
        let data = req.body

        let {id} = req.params
    
        let update = (data, id)
        if(!update) return res.status(400).send({message:'HHave submitted some data that cannot be updated or missing'})
    
        let updatedProduct = await Product.updateOne(
            {_id: id},
            data,
            {new: true}
        )

        if(!updatedProduct) return res.status(404).send({message: 'Product not found'})

            return res.status(200).send({ message: 'Product updated successfully.' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating the information for the category.'})
    }
}

//DELETE PRODUCT
export const deleteProduct = async(req,res)=>{
    try {
        let {id}= req.params

        let product = await Product.findById(id)

        if (!product) return res.status(404).send({message: 'Product not found'})

        await Product.deleteOne({_id:id})

        return res.status(200).send({message:'Product deleted successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting the product'})
    }
}