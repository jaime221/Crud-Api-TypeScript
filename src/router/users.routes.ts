import {Router} from "express"
import UserCrontroller from "../controllers/user.controller"

const {CheckAuht} =  require('../verifyToken/verify')
const router = Router()
const user = UserCrontroller


//metodos 
router.post("/", user.createUser)
router.get("/",  user.getUsers)
router.put("/:id", user.updateUser)
router.get("/:id",user.getById)
router.post("/login",user.loginUser)
router.delete("/:id",user.deleteUser)
export default router


