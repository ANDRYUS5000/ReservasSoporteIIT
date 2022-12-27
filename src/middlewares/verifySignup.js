//valida los datos
import { ROLES } from '../models/role'
import { getDependencias } from '../controllers/dependencia.controller'
import { getTipoEspFis } from '../controllers/tipoEspFis.controller'
import  EspFis from '../models/espaciofisico'

import User from '../models/user'
import dependencia from '../models/dependencia'

export const checkDuplicatedCedorEmail = async (req, res, next) => {
    const user = await User.findOne({ ced: req.body.ced })
    if (user) return res.status(400).json({ message: 'El usuario ya existe' })
    const email = await User.findOne({ email: req.body.email })
    if (email) return res.status(400).json({ message: "El correo ya está registrado" })

    next();
}

export const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({
                    message: "el rol no existe"
                }
                )
            }
        }
    }
    next();
}
export const checkTipoEspExisted = (req, res, next) => {
   getTipoEspFis().then(function(resp){
    let tipo=resp.filter((item)=>item.toJSON().tipo_unidad==req.body.tipo);
    if(tipo){
        next();
    }
    else{
        return res.status(400).json({
            message: "El tipo de espacio físico no existe"
        })
    }
   }).catch(function (err) {
    return res.status(400).json({
        message: "El tipo de espacio físico no existe"
    })
});
}

export const checkDependenciaExist = (req, res, next) => {
    getDependencias().then(function (resp) {
        let dep = resp.filter((item) => item.toJSON().id_unidad == req.body.dependencia);
        if (dep) {
            next();
        } else {
            return res.status(400).json({
                message: "La dependencia no existe" + dep
            })
        }
        
    }).catch(function (err) {
        return res.status(400).json({
            message: "La dependencia no existe #2"
        })
    });
}
export const checkDependencia = (req, res, next) => {
    getDependencias().then(function (resp) {
        let dep = resp.filter((item) => item.toJSON().id_unidad == req.body.dependencia);
        if (dep.length!=0) {
            next();
        } else {
            return res.status(400).json({
                message: "La dependencia no existe #3" + dep
            })
        }
        
    }).catch(function (err) {
        return res.status(400).json({
            message: "La dependencia no existe #4"
        })
    });
};
export const checkEspacioExist = async(req, res, next) => {
    const espacio = await EspFis.findOne({ name:req.body.name})
    if (espacio) return res.status(400).json({ message: 'El espacio ya existe' })
    else  next();
}
