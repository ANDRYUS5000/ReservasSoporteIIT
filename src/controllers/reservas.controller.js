const Reserva = require('../models/reserva')
import User from '../models/user'
const fs = require('fs');
const mongoose = require('mongoose');

export const crearReserva = async (req, res) => {
    const { fini, fend, namevent, user, sitio, state } = req.body
    const r = new Reserva({ fini, fend, namevent, user, sitio, state })
    await r.save()
        .then((reserva) => {
            return res.status(200).json(reserva)
        })
        .catch(err => {
            console.log(err);
            res.json(':/')
        })
}
export const getReservas = async (req, res) => {
    const reservas = await Reserva.find({});
    for (let r of reservas) { // este for trabaja sicronicamente con el codigo
        const s = await User.findOne(r.user).populate(['roles', 'dependencia'])
        r.user = s
    }
    return res.status(200).json(reservas)
}
export const upload = async (req, res) => {
    var paths = req.file.originalname.split(".")
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
    var file = fs.createReadStream(req.file.path).pipe(bucket.openUploadStream(req.file.originalname, { contentType: paths[paths.length - 1] }))
    var fileid = file.id.toString()
    const r = await Reserva.findByIdAndUpdate(req.body.res, { anexo: fileid })
    res.send({ data: "OK" })
}
export const download = async (req, res) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' })
    const cursor = await bucket.find({}).toArray();
    cursor.forEach(el => {
        if (el._id.toString() == req.params.id) {
            bucket.openDownloadStreamByName(el.filename).pipe(fs.createWriteStream('./' + el._id + '.' + el.contentType)). //guarda en carpeta src
                on('error', function (error) {
                    assert.ifError(error);
                }).
                on('finish', function () {
                    console.log('done!');
                    return res.status(200).json(el._id + '.' + el.contentType)
                });
        }
    })
}
export const upda = async (req, res) => {
    const r = await Reserva.findByIdAndUpdate(req.params.id, { state: 'aprobado' }, { new: true })
    getReservas(req, res)
}
export const upds = async (req, res) => {
    const r = await Reserva.findByIdAndUpdate(req.params.id, { state: 'solicitado' }, { new: true })
    getReservas(req, res)
}
export const updr = async (req, res) => {
    const r = await Reserva.findByIdAndUpdate(req.params.id, { state: 'no aprobado' }, { new: true })
    getReservas(req, res)
}
export const updcancel = async (req, res) => {
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, { state: 'cancelado' }, { new: true })
    reservaUser(req, res)
}
export const removeReserva = async (req, res) => {
    console.log("eliminar", req.body)
    try {
        const r = await Reserva.findByIdAndDelete(req.params.id)
        reservaUser(req, res)
        return true;
    }
    catch (error) {
        return false;
    }
}

export const reservaUser = async (req, res) => {
    const reservas = await Reserva.find({});
    const resUser = [];
    for (let r of reservas) { // este for trabaja sicronicamente con el codigo
        if (r.user._id == req.params.id) {
            resUser.push(r)

        }
    }
    return res.status(200).json(resUser)
}