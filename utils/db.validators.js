import User from '../src/user/user.model.js'

export const existUsername = async (username, user)=>{
    const alredyUsername = await User.findOne({username})
    if (alredyUsername && alredyUsername._id != user.uid) {
        console.error(`Username ${username} is alredy taken`)
        throw new Error (`Username ${username} is alredy taken`)
    }
}

export const existEmail = async (email, user)=>{
    const alredyEmail = await User.findOne({email})
    if (alredyEmail && alredyEmail._id != user.uid) {
        console.error(`Email ${email} is alredy taken`)
        throw new Error(`Email ${email} is alredy taken`)
    }
}

export const findUser =  async(id)=>{
    try {
        const userExist = await User.findById(id)
        if(!userExist) return false
        return userExist
    } catch (err) {
        console.error(err)
        return false
    }
}
