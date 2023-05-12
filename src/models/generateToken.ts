import { User } from "./User"


import jwt = require('jsonwebtoken')

//Genera un token al Usuario
export const tokenSign = async (user:User) =>{
    return jwt.sign(
        {
            _id : user.id,
            role: user.rol
        },
        process.env.JWT_SECRET,
        {
            expiresIn :"2h"
        }
    )
}
//Verifica el token 
 export const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return null
    }
}

module.exports = {tokenSign,verifyToken}