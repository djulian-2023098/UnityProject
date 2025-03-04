'use strict'

import Cart from "./cart.model.js"
import Product from "../products/product.model.js"

//TEST CONNECTION
export const test = (req, res)=>{
    return res.send(`Cart routes it's working`)
}

//ADD PRODUCT TO CART
export const addToCart = async(req, res)=>{
    try {
        let data = req.body

        data.user = req.user._id

        const {productId, quantity} = req.body

        const product = await Product.findById(productId)
        if(!product){
            return res.status(404).json({ success: false, message: "Product not found" })
        }

        //Search the active cart from user
        let cart = await Cart.findOne({user: req.user._id, status: "ACTIVE"})

        //Create a new cart
        if(!cart){
            cart = new Cart({
                user: req.user._id,
                products: []
            })
        }

        //Search if the product is alredy on cart
        const existProduct = cart.products.findIndex((p) => p.product.toString() === productId)

        if(existProduct !== -1){
            //If the product is already in the cart increase quantity
            cart.products[existProduct].quantity += quantity
        }else{
            //If the product is not available, add it with the given quantity
            cart.products.push({product: productId, quantity})
        }

        await cart.save()

        return res.send(
            {
                success: true,
                message: "Product add to cart",
                cart
            }
        )

    } catch (error) {
        console.error(error)
        return res.status(500).send({message:"Error adding a product"})
    }
}

//SHOW CART
export const getCart = async (req, res)=>{
    try {
        const cart  = await Cart.findOne({ user: req.user._id, status: "ACTIVE"})

        if (!cart){
            return res.status(404).send({
                success: false,
                message: "Cart not found"
            })
        }
        return res.send({
            success: true,
            message: 'Cart found',
            cart
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting cart'})
    }
}

export const updateCart = async (req, res)=>{
    try {
        let data  = req.body

        let {id} = req.params

        let cart = await Cart.findById(id)

        if(!cart) return res.status(404).send({message:"Cart not found"})

        if(cart.user.toString() !== req.user._id.toString()){
            return res.status(403).send({message: "You can only update your own cart"})
        }

        let update = (data, id)
        if(!update) return res.status(400).send({message: "Have submitted some data that cannot be updated or missing"})
        
        let updateCart = await Cart.updateOne(
            {_id : id},
            data,
            {new: true}
        )

        if(!updateCart) return res.status(404).send({message: "Cart not found"})

        return res.status(200).send({message: 'Cart updated successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: "Error updating cart"})
    }
}

export const deleteCart = async (req, res)=>{
    try {
        let {id} = req.params

        let cart = await Cart.findById(id)

        if(!cart) return  res.status(404).send({message: "Cart not found"})

        if (cart.user.toString() !== req.user._id.toString()) {
                return res.status(403).send({ message: 'You can only delete your own carts' });
        }

        await Cart.deleteOne({_id: id})

        return res.status(200).send({message: "Cart deleted successfully"})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: "Error deleting the cart"})
    }
}