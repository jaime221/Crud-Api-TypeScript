import dotenv  from  'dotenv'
import { Router } from 'express'

// importacion de rutas de nustras entidades
import routerUser from "./users.routes"
import routerRol from "./rol.routes"
dotenv.config()
const URL = process.env.URL

const routes = Router()

// rutas
routes.use(`${URL}/user`,routerUser)
routes.use(`${URL}/rol`,routerRol)

export default routes