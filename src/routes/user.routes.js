import {Router} from 'express'
import { verify } from 'jsonwebtoken';
import * as userCtrl from '../controllers/user.controller'
import {authJwt,verifySingup} from '../middlewares'
const router= Router()

router.post('/registrar',[
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySingup.checkRolesExisted,
    verifySingup.checkDuplicatedCedorEmail
],
userCtrl.createUser);

export default router;