import {Router} from 'express'
import {authJwt} from '../middlewares'
import * as reservaCtrl from '../controllers/reservas.controller'
const router= Router()

router.get('/',[authJwt.verifyToken,authJwt.isAdmin],reservaCtrl.getReservas)
//esta ruta si necesita token y cualquiera puede crear una reserva,
router.post('/solicitar',reservaCtrl.crearReserva)
//aprobar reserva solo lo hace el admin
router.post('/aprobar',[authJwt.verifyToken,authJwt.isAdmin],reservaCtrl.aprobarReserva)
router.get('/:reservaId',reservaCtrl.getReservaId)
//router.put('/:reservaId',verifyToken,reservaCtrl)

export default router;