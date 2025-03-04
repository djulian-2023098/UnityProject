import { Schema, model } from "mongoose";

const cartSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, "Quantity must be at least 1"],
                },
            },
        ],
        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED"],
            default: "ACTIVE",
        },
    },
    {
        timestamps: true, 
    }
);

export default model("Cart", cartSchema);
