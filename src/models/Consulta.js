const mongoose = require('mongoose');
const {Schema}=mongoose;
const ConsultaSchema=new Schema({
    Paciente:{type:mongoose.Types.ObjectId,required:true},
    SintomasPa:{type:Array,required:true},
    SignosPa:{type:Array,required:true},
    PruebaLab:{type:String,required:false},
    ResultPruebaLab:{type:String,required:false},
    PruebaMuerte:{type:String,required:false},
    ResultPruebaMuerte:{type:String,required:false},
    Enfermedades:{type:Array,required:false}
});
module.exports=mongoose.model('consultas',ConsultaSchema);