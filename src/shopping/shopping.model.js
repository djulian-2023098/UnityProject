import { Schema, model } from 'mongoose';

const invoiceSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Cart',
            required: true
        },
        items: [{
            product: { 
                type: Schema.Types.ObjectId, 
                ref: 'Product',
                required: true
            },
            quantity: { 
                type: Number,
                required: true
            },
            price: { 
                type: Number, 
                required: true
            }
        }],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['PENDING', 'COMPLETED'],
            default: 'PENDING'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);

export default model('Invoice', invoiceSchema);
