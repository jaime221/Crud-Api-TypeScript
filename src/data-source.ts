import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port : 3306,
    username : 'root',
    password: 'password',
    database: 'prueba-api',
    logging: true,
    synchronize:true,
    entities : ['dist/models/**/*.js'],
    subscribers:['dist/subscribe/**/*.js'],
    migrations:['dist/migration/**/*.js']
})