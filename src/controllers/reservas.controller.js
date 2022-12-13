import Reserva from '../models/reserva'

export const crearReserva=async(req,res)=> {
    const {fini, fend, namevent, user, depend,sitio, state, anexo} = req.body
    const r=new Reserva({fini, fend, namevent, user, depend,sitio, state, anexo})
    const reservaSaved=await r.save()
    .then(wea=>{
        res.status(201).json(reservaSaved)
    })
    .catch(err=>{
        console.log(err);
        res.json(':/')
    })
}
export const getReservas=async(req,res)=> {
    const reservas=await Reserva.find({});
    return res.status(200).json(reservas)
}
export const getReservaId=(req,res)=> {s
    
}
export const updateReservaId=(req,res)=> {
    
}
export const aprobarReserva=async(req,res)=>{
    const reservas=await Reserva.find();
    res.status(200).json("Reservas aprobadas")
}

