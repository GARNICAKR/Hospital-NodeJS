const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Declaracion del modelo del Schema
const Signo=require('../models/Signo');
//Direccion de Signos Agregar
router.get ('/signos/agregar',isAuthenticated,(req, res)=>{
    res.render('CrudSignos/agregar');
});

//Agregar al DB
router.post('/CrudSignos/agregar',isAuthenticated,async (req,res) => {
  const {Nombre,Importancia}=req.body;
  const errors=[];
  const SignoRepe= Signo.findOne({Nombre:Nombre});
  if(SignoRepe){
    errors.push({text:'(Esta Repetido)'});
  }
  if(!Nombre){
    errors.push({text:'(Escriba un Nombre)'});
  }
  if(!Importancia){
    errors.push({text:'(Escriba un Nombre)'});
  }
  if(errors.length>0){
    req.flash('error_msg', 'No deje Campos en Blanco');
      res.render('CrudSignos/agregar',{
        errors,  
        Nombre,
        Importancia,
      });
  }else{
      const newSigno=new Signo({Nombre,Importancia});
     await newSigno.save();
     req.flash('success_msg', 'Signo Agregado Correctamente');
      res.redirect('/signos/agregar')
  }
});
//Mostrar Datos
router.get('/signos/mostrar',isAuthenticated, async(req,res)=>{
  const signo=await Signo.find().lean();
  res.render('CrudSignos/mostrar',{signo});
});
//Editar Datos
router.get('/signos/editar/:id',isAuthenticated,async (req,res)=>{
  const signo =await Signo.findById(req.params.id).lean();
  res.render('CrudSignos/editar', {signo});
});
router.put('/CrudSignos/editar/:id',isAuthenticated, async (req,res)=>{
  const {_id,Nombre,Importancia}=req.body;
  const errors=[];
  if(!Nombre){
    errors.push({text:'Escriba un Nombre'});
  }
  if(!Importancia){
    errors.push({text:'Escriba un Nombre'});
  }
  if(errors.length>0){
    const signo =await Signo.findById(req.params.id).lean();
      res.render('CrudSignos/editar',{signo, errors});
  }else{
    req.flash('success_msg', 'Signo Editado Correctamente');
    await Signo.findByIdAndUpdate(req.params.id, {Nombre,Importancia});
    res.redirect('/signos/mostrar');
  }

});

//Eliminar Datos
router.delete('/signos/eliminar/:id',isAuthenticated, async(req,res)=>{
  req.flash('success_msg', 'Signo Eliminado Correctamente');
  await Signo.findByIdAndDelete(req.params.id);
  res.redirect('/signos/mostrar')
});

module.exports=router;