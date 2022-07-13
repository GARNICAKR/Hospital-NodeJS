const mongoose = require('mongoose');
const {Schema}=mongoose;
const PruebaMuerteSchema=new Schema({
    tipoPrueba: {type: String,required:true},
});
module.exports=mongoose.model('PruebasMuerte',PruebaMuerteSchema);