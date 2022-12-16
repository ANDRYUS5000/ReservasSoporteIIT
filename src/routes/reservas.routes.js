import {Router} from 'express'
import {authJwt} from '../middlewares'
import * as reservaCtrl from '../controllers/reservas.controller'

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

router.post('/solicitar',reservaCtrl.crearReserva) //cambie el verify aqui
router.post('/upload',upload.single('file'),reservaCtrl.upload)

router.get('/report',reservaCtrl.getReservas)
router.get('/files/:id', reservaCtrl.download)
router.get('/resmoda/:id', reservaCtrl.upda)
router.get('/resmods/:id', reservaCtrl.upds)
router.get('/resmodr/:id', reservaCtrl.updr)

export default router;