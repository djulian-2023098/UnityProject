import { Schema, model } from "mongoose";

const productSchema = Schema(
    {
        name:{
            type: String,
            required: [true, 'Name is required'],
            maxLength: [25, `Can't be overcome 25 characters`]
        },
        description:{
            type: String,
            required: [true, 'Description is required'],
            maxLength: [100, `Can't be overcome 100 characters`]
        },
        price:{
            type: Number,
            required: [true, 'Price is required']
        },
        stock:{
            type: Number,
            required: [true, 'Stock is required']
        },
        sold:{
            type: Number,
            default: 0
        },
        category:{
            type: Schema.Types.ObjectId,
            req: 'Category',
            required: true
        }
    }
)

export default model ('Product', productSchema)