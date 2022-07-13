const mongoose = require('mongoose');
const {Schema}=mongoose;
const SignoSchema=new Schema({
    Nombre: {type: String,required:true},
    Importancia:{type: Number,required:true}
});
module.exports=mongoose.model('Signos',SignoSchema);