const mongoose = require('mongoose');
const bcrypt= require('bcryptjs');
const {Schema}=mongoose;
const UserSchema=new Schema({
    Nombre: {type: String,required:true},
    Apellido: {type: String,required:true},
    email: {type: String,required:true},
    password: {type: String,required:true},
    TipoUsuario: {type: String,required:true},

});
//Me ayuda a encriptar la contraseña
UserSchema.methods.encryptPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

module.exports=mongoose.model('users',UserSchema);