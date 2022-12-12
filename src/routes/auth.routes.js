import {Router} from 'express'
import { verifySingup } from '../middlewares'
const router= Router()

import * as authCtrl from '../controllers/auth.controllers'

//ingresar
router.post('/signin', authCtrl.signIn)
//registrar
router.post('/signup',verifySingup.checkDuplicatedCedorEmail,verifySingup.checkRolesExisted,verifySingup.checkDependenciaExist,
verifySingup.checkDependencia,authCtrl.signUp)
//registrar usuarios como super admin
router.post('/registeruser',verifySingup.checkDuplicatedCedorEmail,verifySingup.checkRolesExisted,verifySingup.checkDependenciaExist,
verifySingup.checkDependencia,authCtrl.registrarUsuario)

router.post('/crearespacio', verifySingup.checkEspacioExist, authCtrl.crearEspacio)

router.get('/dependencias', authCtrl.dependencias)
router.get('/tipoespfis',authCtrl.tipoEspFis)

router.get('/roles',authCtrl.roles)
router.get('/espacios',authCtrl.espacios)

router.get('/getuser/:id',authCtrl.getUser)
export default router;