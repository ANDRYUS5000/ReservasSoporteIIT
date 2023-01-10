import {Router} from 'express'
import {authJwt} from '../middlewares'
import * as reservaCtrl from '../controllers/reservas.controller'
import reserva from '../models/reserva'

const multer=require('multer')
const storage = multer.diskStorage(
    {
        filename:(req,file,cb)=>{
            const ext =file.originalname.split(".").pop()
            cb(null, file.filename+'.'+ext)
        },
        // destination:(req,file,cb)=>{
        //     cb(null,'./public')
        // }
    }
)

const upload=multer({storage})

const router= Router()

router.post('/solicitar',reservaCtrl.crearReserva)
router.post('/upload',upload.single('file'),reservaCtrl.upload)
router.delete('/removeres/:id',reservaCtrl.removeReserva)

router.get('/report',reservaCtrl.getReservas)
router.get('/files/:id', reservaCtrl.download)
router.get('/resmoda/:id', reservaCtrl.upda)
router.get('/resmods/:id', reservaCtrl.upds)
router.get('/resmodr/:id', reservaCtrl.updr)
router.get('/resmodc/:id',reservaCtrl.updcancel)
router.get('/resuser/:id',reservaCtrl.reservaUser)

export default router;