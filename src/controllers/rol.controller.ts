import { Request,Response } from "express"
import { AppDataSource } from "../data-source"
import { Rol } from "../models/Rol"
import { User } from "../models/User"


const rolRepository = AppDataSource.getRepository(Rol)


class RolController{

    static createRol =async (req :Request,res:Response) => {
        const {type,description} = req.body
        
        try {
            const rol = new Rol();
            
            rol.type = type
            rol.description = description

            await rolRepository.save(rol)
            return res.json({
                ok : true,
                msg : "Rol save"
            });
        } catch (error) {
            return res.json({
                ok:false,
                msg : `Error -> ${error}`,
           })
        }
    }
    static getRol =async (req :Request , res : Response) => {
      try {
        const rol = await rolRepository.find({
     
         where :{state:true},
       
        })
       
        return rol.length > 0
        ? res.json({ok: true,rol})
        : res.json({ok :false, msg : "Rol not Fount"})
         }catch (error) {
        return res.json({
            ok: false,
            msg :`Error -> ${error}`,
        });
      }
        
    };
    static getById =async (req:Request , res :Response) => {
        const id  = parseInt(req.params.id);
        try {
            const rol = await rolRepository.findOne({
                where :{id , state : true},

            });
            return rol ? res.json({ok : true , rol
            }):
            res.json({
                ok: false , msg :  "User not Fount"
            })
            
        } catch (error) {
            ; return res.json({
                ok : false,
                msg :`Error ->${error}`,
          });
        }
     }
    static updateRol =async (req : Request , res:Response) => {
        const id = parseInt(req.params.id);
        const {type,description} = req.body
        const repoRol = AppDataSource.getRepository(Rol)

        let rol : Rol ;
        try {
           rol = await repoRol.findOneOrFail({
               where : {id,state:true},
            });
            if(!rol) {
                throw new Error("Rol dont exist in dabe base")   
            }
             rol.description = description,
             rol.type = type,
            await repoRol.save(rol)
            return res.json({
                ok : true,
                msg : "Rol Save",
            });

        } catch (error) {
            return res.json({
                ok : false,
                msg : "Server Error"
            })
        }
    };


    static deleteRol = async (req: Request, res: Response) => {

      //Obtener el id del rol a eliminar  del parametro de la URL y convertirlo a un numero entero 
        const id = parseInt(req.params.id);

        //obtiene el repositorio de la entidad Rol
        const repoRol = AppDataSource.getRepository(Rol); 

        //Busca el rol en la base de datos 
        try {
          const rol = await repoRol.findOne({ where: { id } });

          // si el rol no se encuentra en la base de datos , este lanza un error con el mensaje descriptivo 
          if (!rol) {
            throw new Error("Rol does not exist in the database");
          }
          const newRol = 7; // ID del nuevo rol al que se asignarán los usuarios
      
          const repoUser = AppDataSource.getRepository(User);

          // Buscar el nuevo rol al que se asignarán los usuarios
          const nuevoRol = await repoRol.findOne({ where: { id: newRol } });
          if (!nuevoRol) {
            throw new Error("New role does not exist in the database");
          }
          // Buscar todos los usuarios con el rol que se va a eliminar
          const userRol = await repoUser.find({
            where: {
              rol: {
                id: id,
              },
            },
          });

          
          // Actualizar el campo de rol de cada usuario encontrado y asignar el nuevo rol
          userRol.forEach(async (user) => {
            user.rol = nuevoRol;
            await repoUser.save(user);
          });
      
          rol.state = false;
          await repoRol.save(rol);
          return res.json({
            ok: true,
            msg: "Rol deleted",
          });
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            ok: false,
            msg: "Server error",
          });
        }
    };
}


export default RolController