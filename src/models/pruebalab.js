const mongoose = require('mongoose');
const {Schema}=mongoose;
const PruebaLabSchema=new Schema({
    tipoPrueba: {type: String,required:true},
});
module.exports=mongoose.model('PruebasLab',PruebaLabSchema);