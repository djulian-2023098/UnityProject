'use strict'

import Cart from '../cart/cart.model.js';
import Invoice from './shopping.model.js';
import Product from '../products/product.model.js';

export const completePurchase = async (req, res) => {
    try {
        // Buscar el carrito activo del usuario
        const cart = await Cart.findOne({ user: req.user._id, status: 'ACTIVE' });

        if (!cart) {
            return res.status(404).send({ message: 'No active cart found' });
        }

        // Calcular el precio total y crear los items de la factura
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

        // Crear la factura
        const invoice = new Invoice({
            user: req.user._id,
            cart: cart._id,
            items,
            totalAmount,
            status: 'COMPLETED'
        });

        await invoice.save();

        // Actualizar el estado del carrito a 'COMPLETED'
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
