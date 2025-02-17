'use strict'

import User from '../user/user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jvt.js'

export const test = async (req, res) => {
    return res.send('The user route is running')
}

export const defaultAdmin = async (nameA, surnameA, usernameA, emailA, passwordA, phoneA, roleA) => {
    try {
        let adminFound = await User.findOne({ role: 'ADMIN' })
        if (!adminFound) {
            const data = {
                name: nameA,
                surname: surnameA,
                username: usernameA,
                email: emailA,
                password: await encrypt(passwordA),
                phone: phoneA,
                role: roleA
            }
            let user = new User(data)
            await user.save()
            return console.log('A default admin has been created.')
        } else {
            return console.log('Default admin cannot be created.')
        }

    } catch (err) {
        console.error(err)
        
    }
}

defaultAdmin('Dylan ', 'Julian', '1dylan', 'djulian@gmail.com', '123123Aa!', '123123123', 'ADMIN')


//change a user's role
export const changeRole = async(req, res)=>{
    try {
        let {id} = req.params

        let data = req.body
        let update = checkUpdate(data.role, id)
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be update or missing' })

        let updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        //Validation is the user not exist
        if (!updatedUser) return res.status(404).send({ message: 'User not found' })
        
        return res.status(200).send({message: 'The role has been changed successfully.'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error changing role'})
    }

}


//UPDATE
export const updateUser = async (req, res) => {
    try {
        //Getting the id by the token
        let { _id } = req.user
        
        let { id } = req.params
        
        let data = req.body

        //Validating that the user can only update his own profile or another clients
        let user = await User.findOne({_id: id})

        if((user.role == 'ADMIN') && (_id != id)){ 
            return res.status(403).send({
                message: 'You cannot update another admin, you can only update yourself or clients.'
            })
        }
        
        let update = checkUpdate(data, id)
        if (!update) return res.status(400).send({ message: 'Data cannot be updated or  data missing' })

        let updatedUser = await User.updateOne(
            { _id: id },
            data,
            { new: true }
        )

        if (!updatedUser) return res.status(404).send({ message: 'User not found' })

        return res.status(200).send({message: 'User updated successfully.'})
        
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the user'})
    }
}

//DELETE
export const deleteUser = async(req, res)=>{
    try {
    
        let {id } = req.params
        let {_id} = req.user
        let user = await User.findOne({_id: id})
        //Validation for not deleting a default admin
        if(user.username == 'djulian') return res.status(403).send({message: 'You cannot delete the default admin'})

        //Validation for the user if try to delete another user that not might his own user
        if((user.role == 'ADMIN') && (_id != id)) return res.status(403).send({message: 'You cannot update another admin, you can only update yourself or clients.'})

        let deletedUser = await User.findOneAndDelete(id)

        if (!deletedUser) return res.status(404).send({ message: 'User not found' })
        
        return res.send({message: `Account with username ${deletedUser.name} deleted successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

// ----------------------------------------------------- UPDATE FOR CLIENT ---------------------------------------------------------
/*The clients are only going to update their account. It's not necessary to send the id, it is going to use the token and get it.*/

export const updateClient = async(req,res) =>{
    try {
        let {_id} = req.user
        
        let {id} = req.params

        let data = req.body
        //Validating that the client is the same that is updating
        if(_id != id) return res.status(401).send({message: 'You only can update your account.'})        

        let update = checkUpdate(data, id)

        if(!update) return res.status(400).send({message: 'Data cannot be updated or  data missing'})

        let updatedU = await User.findOneAndUpdate(
            {_id: id},
            data,
            { new: true }
        )

        //Validation of the updated action
        if (!updatedU) return res.status(404).send({ message: 'User not found' })

        return res.status(200).send({message: 'User updated successfully.'})

    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating the user'})
    }
}

//DELETE FOR CLIENT
export const deleteClient = async(req,res)=>{
    try {
        let {_id} = req.user
        
        let { id} = req.params
        
        let {password} = req.body
        //Validating that the client cannot delete an admin
        let user = await User.findOne({_id:id})
        if(user.role == 'ADMIN') return res.status(401).send({message: 'You cannot delete an admin.'})
        
        if(_id != id) return res.status(401).send({message: 'You only can delete your account.'}) 

        let check = await checkPassword(password, user.password)
        if(!check) return res.status(401).send({message: 'Invalid password'})
        
        let deletedU = await User.findOneAndDelete(id)

        if (!deletedU) return res.status(404).send({ message: 'User not found' })
        
        return res.send({message: `Account with username ${deletedU.name} deleted successfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}

