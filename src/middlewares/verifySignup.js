//valida los datos
//se importan los tipos de roles
import { ROLES } from '../models/role'
//se importan las dependencias consultadas en la base de datos
import { getDependencias } from '../controllers/dependencia.controller'
//se importan los tipos de espacios físicos
import { getTipoEspFis } from '../controllers/tipoEspFis.controller'
//se importa el modelo de espacio físico
import  EspFis from '../models/espaciofisico'
//se importa el modelo de usuario
import User from '../models/user'

//se verifica que no haya cédula o correo electrónico duplicado, pues el correo al ser institucional
//debe ser único para cada usuario.
export const checkDuplicatedCedorEmail = async (req, res, next) => {
    //busca el usuario por cédula
    const user = await User.findOne({ ced: req.body.ced })
     //si lo encuentra retorna un mensaje de que ya existe
    if (user) return res.status(400).json({ message: 'El usuario ya existe' })
     //busca el usuario por correo electrónico
    const email = await User.findOne({ email: req.body.email })
    //si lo encuentra retorna un mensaje de que el correo ya existe
    if (email) return res.status(400).json({ message: "El correo ya está registrado" })
 //si no encuentra usuario ni por cédula ni correo deja ejecutar la función siguiente
    next();
}
//verifica si el rol del usuario existe
export const checkRolesExisted = (req, res, next) => {
     //busca que el rol enviado en el body exista en el arreglo de roles declarado
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
             //si no lo encuentra retorna un mensaje de que el rol no existe
            if (!ROLES.includes(req.body.roles[i])) {
                return res.status(400).json({
                    message: "el rol no existe"
                }
                )
            }
        }
    }
    //si lo encuentra permite ejecutar la función siguiente
    next();
}
//verifica si el tipo de espacio existe, esto sirve para registrar un espacio nuevo

export const checkTipoEspExisted = (req, res, next) => {
     //trae todos los tipos de espacios físicos existentes en la base de datos
  
   getTipoEspFis().then(function(resp){
     //compara si el tip enviado por el usuario existe en la base de datos
    let tipo=resp.filter((item)=>item.toJSON().tipo_unidad==req.body.tipo);
    // si el tipo existe permite ejecutar la siguiente función
    if(tipo){
        next();
    }
     //si el tip de espacio no existe envía un mensaje
    else{
        return res.status(400).json({
            message: "El tipo de espacio físico no existe"
        })
    }
   }).catch(function (err) {//en caso de haber una excepción retorna que hubo un error
    return res.status(400).json({
        message: "El tipo de espacio físico no existe"
    })
});
}
//valida si la dependencia del usuario existe
export const checkDependenciaExist = (req, res, next) => {
    //trae todas las dependencias
    getDependencias().then(function (resp) {
        //compara cada una de las dependencias con la enviada para ver si encajan
        let dep = resp.filter((item) => item.toJSON().id_unidad == req.body.dependencia);
        //si la dependencia es encontrada permite continuar con la siguiente función
        if (dep) {
            next();
        } else {
             //si la dependencia no existe retorna un mensaje
            return res.status(400).json({
                message: "La dependencia no existe" + dep
            })
        }
        
    }).catch(function (err) {
        return res.status(400).json({
            //en caso de error envía un mensaje
            message: "error con la base de datos"
        })
    });
}
//verifica si el espacio existe en la base de datos
export const checkEspacioExist = async(req, res, next) => {
    //trae todos los espacios registrados
    const espacio = await EspFis.findOne({ name:req.body.name})
    //si el espacio existe, retorna un mensaje 
    if (espacio) return res.status(400).json({ message: 'El espacio ya existe' })
    //si el espacio no existe permite ejecutar lo siguiente
    else  next();
}
