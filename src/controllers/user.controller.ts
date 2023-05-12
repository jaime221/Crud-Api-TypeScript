import { Request,Response } from "express"
import { User } from "../models/User"
import { AppDataSource } from "../data-source"
import bcrypt from  "bcrypt"
const{tokenSign} = require('../models/generateToken')





const userRepository = AppDataSource.getRepository(User)

const saltRounds = 10; // define el número de rondas de encriptación



class UserCrontroller{

    //Crear Usuario
    static createUser = async (req: Request, res: Response) => {
        const { name, age, password, email, rolId } = req.body;
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
      
        try {
          const user = new User();
          user.name = name;
          user.age = age;
          user.password = hashedPassword;
          user.email = email;
          user.rol = rolId;
      
          await userRepository.save(user);
      
        //   // Generar token JWT
        //   const token = jwt.sign({ userId: user.id }, 'secret-key');
      
          return res.json({
            ok: true,
            msg: 'User was saved',
          });
        } catch (error) {
          return res.json({
            ok: false,
            msg: `Error -> ${error}`,
          });
        }
    };
  
  
   
    //Busca todos los Usuarios en la base de Datos
    static getUsers = async (req:Request, rest:Response)=>{
        try {
            const users = await userRepository.find({
                relations:{
                    rol: true
                },
            where:{state:true},
            })
            
            return users.length > 0
            ? rest.json({ok : true, users})
            : rest.json ({ok: false,msg :"User not fount"})
          } catch (error) {
            return rest.json({
             ok : false,
             msg :`Error ->${error}`,
            });
        }
        
    };

    //Busca Un usuario por medio de su Id 
    static  getById = async (req:Request,rest: Response) => {
        const id  = parseInt(req.params.id);
        try {
            const user = await userRepository.findOne({
                where : {id, state: true},
            });

         return user ? rest.json({ok : true, user
        })
        :rest.json({
            ok:false,msg: "User not found "
        })
        } catch (error) {
           ; return rest.json({
             ok : false,
             msg :`Error ->${error}`,
            })
        }
    }

    //Actualiza un Usuario 
    static updateUser = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        const { name,  age } = req.body;
        const repoUser = AppDataSource.getRepository(User);
        let user: User;
        try {
            user = await repoUser.findOneOrFail({
                where: { id, state: true, },
            });
            if (!user) {
                throw new Error("User dont exist in data base");
            }
                user.name = name,
                user.age = age,  
                user.password,
                user.email,
            await repoUser.save(user);
            return res.json({
                ok: true,
                msg: "User was update",
            });
        } catch (error) {
            return res.json({
                ok: false,
                msg: "Server error",
            });
        }
    };
    //Elimina un usuario en este caso actualiza su estado
    static deleteUser =async (req : Request , res :Response)=>{
        const id = parseInt(req.params.id);
        const repoUser = AppDataSource.getRepository(User);
        try{
            const user = await repoUser.findOne({
                where:{id},
            });
            console.log(user)
            if(!user){
                throw new Error("user dont exist in date base");
            }
            user.state = false;
            await repoUser.save(user);
            return res.json({
                ok:true,
                msg : "User was Delete",
            });
        }catch (e){
            return  res.json({
                ok:false,
                msg : "Server Error"
            })
        }
    };

    static loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;
      
        // Buscar usuario por correo electrónico
        const user = await userRepository.findOne({ where: { email } });
      
        if (!user) {
          return res.status(401).json({ msg: "Correo electrónico o contraseñas incorrectas" });
        }
      
        // Verificar si la contraseña es correcta
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

       const tokeSesion = await  tokenSign(user)
       if(isPasswordCorrect){
        res.send({
            data : user,
            tokeSesion
        })
       }
      
        if (!isPasswordCorrect) {
          return res.status(401).json({ msg: "Credentials Incorrects" });
        }
      
        // Si las credenciales son válidas, retornar un mensaje de éxito
        return res.json({
          ok: true,
          tokeSesion,
          msg: "Has iniciado sesión exitosamente",
        });
    };
      
      
      
      
      
}

export default UserCrontroller
