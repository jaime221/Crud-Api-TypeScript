import  {verifyToken} from "../models/generateToken"


export  const CheckAuht =async (req , res, next)=>{
    try {
        const token = req.headers.authorization.split(' ').pop()
        console.log(token)
        const tokenData = await verifyToken(token)
        console.log(tokenData)
        if(tokenData){
            next()
        }
        else{
            res.status(409)
            res.send({error:'ACCESO DENEGADO'})
        }
    } catch (e) {
        console.log(e)
        res.status(409)
        res.send({error:'Acceso denegado'})
    }
}
