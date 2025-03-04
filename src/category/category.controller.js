'use strict'

import { checkUpdate } from '../../utils/encrypt.js'
import Category from './category.model.js'
import Product from '../products/product.model.js'

export const test = (req, res) => {
    return res.send(`Categories route it's working`)
}

//CREATE A DEFAULT CATEGORY
export const defaultCategory = async (nameC, descriptionC) => {
    try {
        const categoryFound = await Category.findOne({ clasification: 'CATEGORY' })
        const categoryDFound = await Category.findOne({clasification: 'DEFAULT'})
        if (!categoryFound && !categoryDFound) {
            const data = {
                name: nameC,
                description: descriptionC,
                clasification: 'DEFAULT'
            }
            const category = new Category(data)
            await category.save()
            return console.log('A default category has been created.')
        } else {
            return console.log('Default category cannot be created.')
        }

    } catch (err) {
        console.error(err)
        
    }
}

defaultCategory('Predeterminado', 'Default category')

//ADD
export const addCategory = async (req, res) => {
    try {
        let data = req.body

        data.clasification = 'CATEGORY'      
    
        let category = new Category(data)
        
        await category.save()
        
        return res.status(200).send({ message: 'Category added successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: 'Error creating the category.' })
    }
}

//GET ALL
export const getAllCategories = async (req,res )=>{
    try {
        const categories = await Category.find()
        return res.send(categories)
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error getting the categories.'})
    }

}

//UPDATE
export const updateCategory = async(req, res)=>{
    try {
        
        let data = req.body
        
        let { id} = req.params
        
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing'})

        
        let updatedCategory = await Category.updateOne(
            {_id: id},
            data,
            {new: true}
        )
        
        if (!updatedCategory) return res.status(404).send({ message: 'User not found' })
        
        return res.status(200).send({ message: 'Category updated successfully.' })
        

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the information for the category.'})
    }
}


//Delete
 export const deleteCategory = async(req, res)=>{
    try {
        let {id} = req.params
        
        let category = await Category.findById(id)
        
        if (!category) return res.status(404).send({ message: 'Category not found' })
        
        if(category.clasification == 'DEFAULT') return res.status(401).send({message: 'You cannot delete the default category.'})

        //Change the products to a default category (We will add it later when we have products.)
        let products = await Product.find()
        let categoryDefault = await Category.findOne({clasification: 'DEFAULT'})
        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            if (product.category == id){
                product.category = categoryDefault.id
                await product.save()
            }
        }
        
        await Category.deleteOne({ _id: id })
        
        return res.status(200).send({ message: 'Category deleted successfully.' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting the category.'})
    }
 }