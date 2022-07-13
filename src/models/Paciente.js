const mongoose = require('mongoose');
const {Schema}=mongoose;
const PacienteSchema=new Schema({
    Nombre: {type: String,required:true},
    Apellido: {type: String,required:true},
    NSS: {type: String,required:true},
    DNI: {type: String,required:true},
    Edad:{type:Number,required:true},
    Peso:{type:Number,required:true},
    Altura:{type:Number,required:true}   
});
module.exports=mongoose.model('pacientes',PacienteSchema);