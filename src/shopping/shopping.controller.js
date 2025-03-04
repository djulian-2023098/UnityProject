'use strict'

import Cart from '../cart/cart.model.js';
import Invoice from './shopping.model.js';
import Product from '../products/product.model.js';

export const completePurchase = async (req, res) => {
    try {
        //Search cart from user
        const cart = await Cart.findOne({ user: req.user._id, status: 'ACTIVE' });

        if (!cart) {
            return res.status(404).send({ message: 'No active cart found' });
        }

        //Calculate the total price and create the invoice items
        let totalAmount = 0;
        const items = [];

        for (let productInCart of cart.products) {
            const product = await Product.findById(productInCart.product);
            if (!product) {
                return res.status(404).send({ message: `Product with ID ${productInCart.product} not found` });
            }

            const itemPrice = product.price * productInCart.quantity;
            totalAmount += itemPrice;

            items.push({
                product: product._id,
                quantity: productInCart.quantity,
                price: itemPrice
            });
        }

        //Create an invoice
        const invoice = new Invoice({
            user: req.user._id,
            cart: cart._id,
            items,
            totalAmount,
            status: 'COMPLETED'
        });

        await invoice.save();

        //Change cart status
        cart.status = 'COMPLETED';
        await cart.save();

        return res.status(200).send({
            success: true,
            message: 'Purchase completed successfully',
            invoice
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error completing purchase' });
    }
};

export const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const invoices = await Invoice.find({ user: userId }).sort({ createdAt: -1 }); 

        if (!invoices || invoices.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No purchase history found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Purchase history retrieved successfully",
            invoices
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success: false,
            message: "Error retrieving purchase history"
        });
    }
};
