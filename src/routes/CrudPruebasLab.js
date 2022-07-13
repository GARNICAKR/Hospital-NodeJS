const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Declaracion del modelo del Schema
const pruebaLab=require('../models/pruebalab');
//Direccion de pruebas-laboratorio Agregar
router.get ('/prueba-laboratorio/agregar',isAuthenticated,(req, res)=>{
    res.render('CrudPruebasLab/agregar');
});

//Agregar al DB
router.post('/CrudPruebasLab/agregar',isAuthenticated,async (req,res) => {
  const {tipoPrueba}=req.body;
  const errors=[];
  if(!tipoPrueba){
    errors.push({text:'Escriba el DNI'});
  }
  if(errors.length>0){
    req.flash('error_msg', 'No deje Campos en Blanco');
      res.render('CrudPruebasLab/agregar',{
        errors,  
        tipoPrueba
      });
  }else{
      const newpruebaLab=new pruebaLab({tipoPrueba});
     await newpruebaLab.save();
     req.flash('success_msg', 'Prueba de Laboratorio Agregado Correctamente');
      res.redirect('/prueba-laboratorio/mostrar')
  }
});
//Mostrar Datos
router.get('/prueba-laboratorio/mostrar',isAuthenticated, async(req,res)=>{
  const pruebaslaboratorio=await pruebaLab.find().lean();
  res.render('CrudPruebasLab/mostrar',{pruebaslaboratorio});
});
//Editar Datos
router.get('/prueba-laboratorio/editar/:id',isAuthenticated,async (req,res)=>{
  const pruebaslaboratorio =await pruebaLab.findById(req.params.id).lean();
  res.render('CrudPruebasLab/editar', {pruebaslaboratorio});
});
router.put('/CrudPruebasLab/editar/:id',isAuthenticated, async (req,res)=>{
  const {_id,tipoPrueba}=req.body;
  const errors=[];
  if(!tipoPrueba){
    errors.push({text:'Escriba el DNI'});
  }
  if(errors.length>0){
    const pruebaslaboratorio =await pruebaLab.findById(req.params.id).lean();
      res.render('CrudPruebasLab/editar',{pruebaslaboratorio, errors});
  }else{
    req.flash('success_msg', 'Prueba de Laboratorio Editado Correctamente');
    await pruebaLab.findByIdAndUpdate(req.params.id, {tipoPrueba});
    res.redirect('/prueba-laboratorio/mostrar');
  }
 
});

//Eliminar Datos
router.delete('/prueba-laboratorio/eliminar/:id',isAuthenticated, async(req,res)=>{
  req.flash('success_msg', 'pruebaLab Eliminado Correctamente');
  await pruebaLab.findByIdAndDelete(req.params.id);
  res.redirect('/prueba-laboratorio/mostrar')
});

module.exports=router;