const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Declaracion del modelo del Schema
const EnfermedadDB=require('../models/Enfermedad');
const SintomasDB=require('../models/Sintoma');
const SignosDB=require('../models/Signo');
//Direccion de Enfermedad Agregar
router.get ('/enfermedad/agregar',isAuthenticated,async(req, res)=>{
  const sintomas=await SintomasDB.find().lean();
  const signos=await SignosDB.find().lean();
    res.render('CrudEnfermedad/agregar',{sintomas,signos});
});


//Agregar al DB
router.post('/CrudEnfermedad/agregar',async (req,res) => {
  const {Enfermedad,Sintomas,Signos}=req.body;

  const errors=[];
  if(!Enfermedad){
    errors.push({text:'(Escriba un Nombre)'});
  }
  if(!Sintomas){
    errors.push({text:'Escriba sus Apellidos'});
  }
  if(!Signos){
    errors.push({text:'Escriba el NSS'});
  }
  if(errors.length>0){
    req.flash('error_msg', 'No deje Campos en Blanco');
      res.render('CrudEnfermedad/agregar',{
        errors,  
        Enfermedad,
        SignosEn,
        SintomasEn
      });
  }else{
    var band =0;
    const SintomasId=[];
    const SignosId=[];
    ////////////////Obteniendo Datos//////////////////////
   /* var banderaSigno=0,banderaSintoma=0,contbanderaSintoma=0,contbanderaSigno=0;
    SignosEn.forEach(async Signos=>{
      const SignoPor= await SignosDB.findOne({Nombre:Signos});
      if(SignosEn[contbanderaSigno+1]==null){
        banderaSigno=1;
        console.log(banderaSigno);
      }

      contbanderaSigno++;
      SignosId.push(SignoPor._id);
    });

    SintomasEn.forEach(async Sintomas=>{
      const SintomasPor= await SintomasDB.findOne({Nombre:Sintomas});
      if(SintomasEn[contbanderaSintoma+1]==null){
        banderaSigno=1;
        console.log(banderaSigno);
      }
      contbanderaSintoma++;
      SintomasId.push(SintomasPor._id);
    });*/
    ///////////////////////////////////////////////////////////////
    /*
    SintomasEn.forEach( element => 
      {
       sintomas.Nombre.forEach(async sintoma=>
        {
            if(sintoma==element){
              SintomasId.push(sintoma._id);
            }
       });
    });
    SignosEn.forEach( element => 
      {
       signos.Nombre.forEach(async signo=>
        {
            if(signo==element){
              SignosId.push(signo._id);
            }
       });
    });*/

    //if(banderaSigno==1){
 
          const newEnfermedad=new EnfermedadDB({Enfermedad,Sintomas,Signos});
        await newEnfermedad.save();
        req.flash('success_msg', 'Enfermedad Agregado Correctamente');
          res.redirect('/enfermedad/mostrar')
      
    //}
  }
});
//Mostrar Datos
router.get('/enfermedad/mostrar',isAuthenticated, async(req,res)=>{
  const enfermedad=await EnfermedadDB.find().lean();
 
  res.render('CrudEnfermedad/mostrar',{enfermedad});
});
//Editar Datos
router.get('/enfermedad/editar/:id',isAuthenticated,async (req,res)=>{
  const enfermedad =await EnfermedadDB.findById(req.params.id).lean();
  const sintomas=await SintomasDB.find().lean();
  const signos=await SignosDB.find().lean();
  res.render('CrudEnfermedad/editar', {enfermedad,sintomas,signos});
});
router.put('/CrudEnfermedad/editar/:id',isAuthenticated, async (req,res)=>{
  const {_id,Enfermedad,Sintomas,Signos}=req.body;
  const errors=[];
  if(!Enfermedad){
    errors.push({text:'Escriba un Nombre'});
  }
  if(!Sintomas){
    errors.push({text:'Escriba sus Apellidos'});
  }
  if(!Signos){
    errors.push({text:'Escriba el NSS'});
  }
  if(errors.length>0){
    const enfermedad =await EnfermedadDB.findById(req.params.id).lean();
      res.render('CrudEnfermedad/editar',{enfermedad, errors});
  }else{
    req.flash('success_msg', 'Enfermedad Editado Correctamente');
    await EnfermedadDB.findByIdAndUpdate(req.params.id, {Enfermedad,Sintomas,Signos});
    res.redirect('/enfermedad/mostrar');
  }
 
});

//Eliminar Datos
router.delete('/enfermedad/eliminar/:id',isAuthenticated, async(req,res)=>{
  req.flash('success_msg', 'Enfermedad Eliminado Correctamente');
  await EnfermedadDB.findByIdAndDelete(req.params.id);
  res.redirect('/enfermedad/mostrar')
});

module.exports=router;