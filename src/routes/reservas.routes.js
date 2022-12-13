import {Router} from 'express'
import {authJwt} from '../middlewares'
import * as reservaCtrl from '../controllers/reservas.controller'
const router= Router()

router.get('/report',reservaCtrl.getReservas)
//esta ruta si necesita token y cualquiera puede crear una reserva,
router.post('/solicitar',reservaCtrl.crearReserva)//cambie el verify aqui
//aprobar reserva solo lo hace el admin
router.post('/aprobar',[authJwt.verifyToken,authJwt.isAdmin],reservaCtrl.aprobarReserva)
router.get('/:reservaId',reservaCtrl.getReservaId)
//router.put('/:reservaId',verifyToken,reservaCtrl)

export default router;