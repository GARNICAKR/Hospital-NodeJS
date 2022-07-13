const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Declaracion del modelo del Schema
const pruebaMuerte=require('../models/pruebamuerte');
//Direccion de pruebas-muerte Agregar
router.get ('/prueba-muerte/agregar',isAuthenticated,(req, res)=>{
    res.render('CrudPruebasMuerte/agregar');
});

//Agregar al DB
router.post('/CrudPruebasMuerte/agregar',isAuthenticated,async (req,res) => {
  const {tipoPrueba}=req.body;
  const errors=[];
  if(!tipoPrueba){
    errors.push({text:'Escriba el DNI'});
  }
  if(errors.length>0){
    req.flash('error_msg', 'No deje Campos en Blanco');
      res.render('CrudPruebasMuerte/agregar',{
        errors,  
        tipoPrueba
      });
  }else{
      const newpruebaMuerte=new pruebaMuerte({tipoPrueba});
     await newpruebaMuerte.save();
     req.flash('success_msg', 'Prueba de muerte Agregado Correctamente');
      res.redirect('/prueba-muerte/mostrar')
  }
});
//Mostrar Datos
router.get('/prueba-muerte/mostrar',isAuthenticated, async(req,res)=>{
  const pruebasmuerte=await pruebaMuerte.find().lean();
  res.render('CrudPruebasMuerte/mostrar',{pruebasmuerte});
});
//Editar Datos
router.get('/prueba-muerte/editar/:id',isAuthenticated,async (req,res)=>{
  const pruebasmuerte =await pruebaMuerte.findById(req.params.id).lean();
  res.render('CrudPruebasMuerte/editar', {pruebasmuerte});
});
router.put('/CrudPruebasMuerte/editar/:id',isAuthenticated, async (req,res)=>{
  const {_id,tipoPrueba}=req.body;
  const errors=[];
  if(!tipoPrueba){
    errors.push({text:'Escriba el DNI'});
  }
  if(errors.length>0){
    const pruebasmuerte =await pruebaMuerte.findById(req.params.id).lean();
      res.render('CrudPruebasMuerte/editar',{pruebasmuerte, errors});
  }else{
    req.flash('success_msg', 'Prueba de muerte Editado Correctamente');
    await pruebaMuerte.findByIdAndUpdate(req.params.id, {tipoPrueba});
    res.redirect('/prueba-muerte/mostrar');
  }
 
});

//Eliminar Datos
router.delete('/prueba-muerte/eliminar/:id',isAuthenticated, async(req,res)=>{
  req.flash('success_msg', 'pruebaMuerte Eliminado Correctamente');
  await pruebaMuerte.findByIdAndDelete(req.params.id);
  res.redirect('/prueba-muerte/mostrar')
});

module.exports=router;