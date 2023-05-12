import 'reflect-metadata'
import dotenv from 'dotenv'
import Server from './server/server'
import { AppDataSource } from './data-source'

dotenv.config()

const server  = new Server()
server.listen()

AppDataSource.initialize().then(async (conection)=>{
    if(conection){
        console.log('**** Conection with database is succes****')
    }
}).
catch((error)=>console.log('***Error in conection with data base'+ error))