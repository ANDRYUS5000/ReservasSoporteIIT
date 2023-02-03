import {Router} from 'express'
import {authJwt} from '../middlewares'
import * as reservaCtrl from '../controllers/reservas.controller'

//librería necesaria para el manejo de archivos
const multer=require('multer')

//variable para subir los archivos
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
//variable para realizar la carga del documento
const upload=multer({storage})
//constante router para redirigir
const router= Router()

//ruta para solicitar una reserva
router.post('/solicitar',reservaCtrl.crearReserva)
//ruta para cargar un archivo
router.post('/upload',upload.single('file'),reservaCtrl.upload)

//ruta para eliminar una reserva por su id
router.delete('/removeres/:id',reservaCtrl.removeReserva)

//ruta para obtener todas las reservas
router.get('/report',reservaCtrl.getReservas)
//ruta para obtener las reservas de un determinado usuario
router.get('/resuser/:id',reservaCtrl.reservaUser)
//ruta para descargar archivo anexo
router.get('/files/:id', reservaCtrl.download)
//ruta para obtener una reserva y modificar su estado a aprobado
router.get('/resmoda/:id', reservaCtrl.upda)
//ruta para obtener una reserva y modificar su estado a solicitado
router.get('/resmods/:id', reservaCtrl.upds)
//ruta para obtener una reserva y modificar su estado a no aprobado
router.get('/resmodr/:id', reservaCtrl.updr)
//ruta para obtener una reserva y modificar su estado a cancelado
router.get('/resmodc/:id', reservaCtrl.updcancel)

export default router;