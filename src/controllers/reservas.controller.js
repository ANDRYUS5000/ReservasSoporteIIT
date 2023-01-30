const Reserva = require('../models/reserva')
import User from '../models/user'
import TipoFis from '../models/tipoEspFis'
import EspFis from '../models/espaciofisico'
const fs = require('fs');
const mongoose = require('mongoose');
//Método para crear Reserva en la base de datos
export const crearReserva=async(req,res)=> {
     //se destructura el body para obtener los parámetros para registrar la reserva
    const {fini, fend, namevent, user, sitio, state} = req.body
    //se busca el espacio físico para obtener su tipo
    await EspFis.findOne({name:sitio}).then(async es=>{
        //una vez se trae el espacio físico se obtiene su tipo 
        await TipoFis.find({_id:es.tipo_espacio}).then(async ess=>{
            //se crea una variable para guardar el lugar y el nombre del tipo de espacio
            let sitex={
                name:sitio,
                tipo:ess[0].name
            }
            //se crea la nueva reserva con los datos enviados por el usuario
            const r=new Reserva({fini, fend, namevent, user, sitio:sitex, state})
            //se envia el objeto reserva a la base de datos
            await r.save()
            .then((reserva)=>{
                //si se ejecutó la operación exitosamente se envia un estatus 200 y la reserva
                return res.status(200).json(reserva)
            })
            .catch(err=>{
                //si se presenta error al enviar la solicitud se envia mensaje de error
                res.json('error')
            })
        })
    })
}
//Método para obtener las reservas alamacenadas en la base de datos
export const getReservas=async(req,res)=> {
    //variable que alamcena todas las reservas encontradas en la base de datos
    const reservas = await Reserva.find({});
    //ciclo que pobla una a una las reservas en el campo de usuario que a su vez trae roles y dependencias
    for (let r of reservas) { // este ciclo for trabaja sicronicamente con el codigo
        const s=await User.findOne(r.user).populate(['roles','dependencia'])
        r.user = s
    }
    //se retornan todas las reservas con sus datos completos
    return res.status(200).json(reservas)
}
//Método para cargar un archivo
export const upload=async(req,res)=>{
    //se obtiene la ruta del archivo
    var paths=req.file.originalname.split(".")
    const bucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName:'uploads'})
    var file=fs.createReadStream(req.file.path).pipe(bucket.openUploadStream(req.file.originalname, {contentType:paths[paths.length-1]}))
    var fileid=file.id.toString()
    const r=await Reserva.findByIdAndUpdate(req.body.res,{anexo:fileid})
    res.send({data:"OK"})
}
//Método para descargar documentos
export const download=async(req,res)=>{
    const bucket=new mongoose.mongo.GridFSBucket(mongoose.connection.db, {bucketName:'uploads'})
    const cursor=await bucket.find({}).toArray();
    cursor.forEach(el=>{
        if (el._id.toString() == req.params.id) {
            bucket.openDownloadStreamByName(el.filename).pipe(fs.createWriteStream('./'+el._id+'.'+el.contentType)). //guarda en carpeta src
            on('error', function(error) {
              assert.ifError(error);
            }).
            on('finish', function() {
              console.log('done!');
              return res.status(200).json(el._id+'.'+el.contentType)
            });
        }
    })
}
//Método para actualizar el estado de una reserva a aprobado
export const upda=async (req,res)=> {
    //se busca la reserva y se le cambia el estado
    const r= await Reserva.findByIdAndUpdate(req.params.id, {state:'aprobado'}, {new:true})
    //se envían las reservas actualizadas
    getReservas(req,res)
}
//Método para acualizar el estado de una reserva a solicitado
export const upds=async(req,res)=> {
     //se busca la reserva y se le cambia el estado
    const r= await Reserva.findByIdAndUpdate(req.params.id, {state:'solicitado'}, {new:true})
     //se envían las reservas actualizadas
    getReservas(req,res)
}
//Método para actualizar el estado de una reserva a no aprobado
export const updr=async(req,res)=> {
     //se busca la reserva y se le cambia el estado
    const r= await Reserva.findByIdAndUpdate(req.params.id, {state:'no aprobado'}, {new:true})
      //se envían las reservas actualizadas
    getReservas(req,res)
}
//Método para actualizar el estado de una reserva a cancelado
export const updcancel=async(req,res)=> {
     //se busca la reserva y se le cambia el estado
    const r= await Reserva.findByIdAndUpdate(req.params.id, {state:'cancelado'}, {new:true})
     //se envían las reservas actualizadas
    getReservas(req,res)
}
//Método para remover reserva por id, solo sirve para las reservas solicitadas o no aprobadas
export const removeReserva = async (req, res) => {
    console.log("eliminar", req.body)
    try {
        //Se busca la reserva y se la elimina
        const r = await Reserva.findByIdAndDelete(req.params.id)
        reservaUser(req, res)
        return true;
    }
    catch (error) {
        return false;
    }
}
//Método para obtener las reservas del usuario que tiene iniciada sesión
export const reservaUser = async (req, res) => {
    const reservas = await Reserva.find({});
    const resUser = [];
    for (let r of reservas) { // este for trabaja sicronicamente con el codigo
        if (r.user._id == req.params.id) {
            console.log(`user ${r.user._id} param ${req.params.id}`);
            resUser.push(r)
        }
    }
    return res.status(200).json(resUser)
}