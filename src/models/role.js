import {Schema,model} from 'mongoose'
export const ROLES=["USER","ADMIN","SUPERA"]

const roleSchema=new Schema({
    name:String
},{
    versionKey:false
})

export default model('Role',roleSchema)