const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Declaracion del modelo del Schema
const Paciente=require('../models/Paciente');
//Direccion de Pacientes Agregar
router.get ('/pacientes/agregar',isAuthenticated,(req, res)=>{
    res.render('CrudPacientes/agregar');
});

//Agregar al DB
router.post('/CrudPacientes/agregar',isAuthenticated,async (req,res) => {
  const {Nombre,Apellido,NSS,DNI,Edad,Peso,Altura}=req.body;
  const errors=[];
  if(!Nombre){
    errors.push({text:'(Escriba un Nombre)'});
  }
  if(!Apellido){
    errors.push({text:'Escriba sus Apellidos'});
  }
  if(!NSS){
    errors.push({text:'Escriba el NSS'});
  }
  if(!DNI){
    errors.push({text:'Escriba el DNI'});
  }
  if(!Edad){
    errors.push({text:'Escriba el DNI'});
  }
  if(!Altura){
    errors.push({text:'Escriba el DNI'});
  }
  if(!Peso){
    errors.push({text:'Escriba el DNI'});
  }
  if(errors.length>0){
    req.flash('error_msg', 'No deje Campos en Blanco');
      res.render('CrudPacientes/agregar',{
        errors,  
        Nombre,
          Apellido,
          NSS,
          DNI,
          Altura,
          Peso,
          Edad
      });
  }else{
      const newPaciente=new Paciente({Nombre,Apellido,NSS,DNI,Edad,Altura,Peso});
     await newPaciente.save();
     req.flash('success_msg', 'Paciente Agregado Correctamente');
      res.redirect('/pacientes/mostrar')
  }
});
//Mostrar Datos
router.get('/pacientes/mostrar',isAuthenticated, async(req,res)=>{
  const pacientes=await Paciente.find().lean();
  res.render('CrudPacientes/mostrar',{pacientes});
});
//Editar Datos
router.get('/pacientes/editar/:id',isAuthenticated,async (req,res)=>{
  const paciente =await Paciente.findById(req.params.id).lean();
  res.render('CrudPacientes/editar', {paciente});
});
router.put('/CrudPacientes/editar/:id',isAuthenticated, async (req,res)=>{
  const {_id,Nombre,Apellido,NSS,DNI,Edad,Peso,Altura}=req.body;
  const errors=[];
  if(!Nombre){
    errors.push({text:'Escriba un Nombre'});
  }
  if(!Apellido){
    errors.push({text:'Escriba sus Apellidos'});
  }
  if(!NSS){
    errors.push({text:'Escriba el NSS'});
  }
  if(!DNI){
    errors.push({text:'Escriba el DNI'});
  }
  if(!Edad){
    errors.push({text:'Escriba el DNI'});
  }
  if(!Altura){
    errors.push({text:'Escriba el DNI'});
  }
  if(!Peso){
    errors.push({text:'Escriba el DNI'});
  }
  if(errors.length>0){
    const paciente =await Paciente.findById(req.params.id).lean();
      res.render('CrudPacientes/editar',{paciente, errors});
  }else{
    req.flash('success_msg', 'Paciente Editado Correctamente');
    await Paciente.findByIdAndUpdate(req.params.id, {Nombre,Apellido,NSS,DNI,Edad,Peso,Altura});
    res.redirect('/pacientes/mostrar');
  }
 
});

//Eliminar Datos
router.delete('/pacientes/eliminar/:id',isAuthenticated, async(req,res)=>{
  req.flash('success_msg', 'Paciente Eliminado Correctamente');
  await Paciente.findByIdAndDelete(req.params.id);
  res.redirect('/pacientes/mostrar')
});

module.exports=router;