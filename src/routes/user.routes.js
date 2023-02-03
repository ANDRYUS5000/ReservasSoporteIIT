import {Router} from 'express'
import { verify } from 'jsonwebtoken';
import * as userCtrl from '../controllers/user.controller'
import {authJwt,verifySingup} from '../middlewares'
const router= Router()

//ruta para registrar un usuario si quien lo hace es Super Administrador
router.post('/registrar',[
     //verifica que el usuario haya iniciado sesión y haya token
    authJwt.verifyToken,
     //verifica que el usuario sea super admin
    authJwt.isSuperAdmin,
    //Verifica que el rol enviado exista
    verifySingup.checkRolesExisted,
     //Verifica que el usuario no esté registrado
    verifySingup.checkDuplicatedCedorEmail
],
//si todo es correcto se crea el usuario
userCtrl.createUser);

export default router;