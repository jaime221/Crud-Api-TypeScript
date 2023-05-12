import { Router } from "express";
import RolController from "../controllers/rol.controller";
import {CheckAuht} from '../verifyToken/verify'
const router = Router()

const rol = RolController

//metodos
router.post("/", rol.createRol)
router.get("/" ,CheckAuht,rol.getRol)
router.get("/:id",rol.getById)
router.put ("/:id",rol.updateRol)
router.delete("/:id",rol.deleteRol)

export default router