import {Router} from 'express'
import { verifySingup } from '../middlewares'
const router= Router()

import * as authCtrl from '../controllers/auth.controllers'

//ingresar
router.post('/signin', authCtrl.signIn)
//registrar
router.post('/signup',verifySingup.checkDuplicatedCedorEmail,verifySingup.checkRolesExisted,verifySingup.checkDependenciaExist,
verifySingup.checkDependenciaExist,authCtrl.signUp)
//registrar usuarios como super admin
router.post('/registeruser',verifySingup.checkDuplicatedCedorEmail,verifySingup.checkRolesExisted,verifySingup.checkDependenciaExist,
verifySingup.checkDependenciaExist,authCtrl.registrarUsuario)

//ruta para crear espacios, primero se verifica si el espacio o no y en base a esto se ejecuta el método crear espacio
router.post('/crearespacio', verifySingup.checkEspacioExist, authCtrl.crearEspacio)

//ruta para obtener las dependencias
router.get('/dependencias', authCtrl.dependencias)
//ruta para obtener los tipos de espacios físicos
router.get('/tipoespfis',authCtrl.tipoEspFis)
//ruta para obtener los códigos de los tipos de espacios físicos
router.get('/tipoEspFisCode',authCtrl.tipoEspFisCode)
//ruta para obtener los roles
router.get('/roles',authCtrl.roles)
//ruta para obtener los espacios físicos
router.get('/espacios',authCtrl.espacios)
//ruta para obtener la reservas de un usuario
router.get('/getuser/:id',authCtrl.getUser)
export default router;