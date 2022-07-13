const mongoose = require('mongoose');
const {Schema}=mongoose;
const EnfermedadesSchema=new Schema({
    Enfermedad: {type: String,required:true},
    Sintomas:{type:Array,required:true},
    Signos:{type:Array,required:true}
});
module.exports=mongoose.model('Enfermedades',EnfermedadesSchema);