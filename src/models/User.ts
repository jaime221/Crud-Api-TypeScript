import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./Rol";

@Entity ()
export class  User{

@PrimaryGeneratedColumn()
id : number

@Column()
 name : string

@Column()
age : number

@ManyToOne(()=>Rol ,(rol)=> rol.user)
rol : Rol

@Column()
password : string

@Column()
email : string


@Column({default:true})
  state : boolean
}