const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Declaracion del modelo del Schema
const ConsultaDB=require('../models/Consulta');
const PacienteDB=require('../models/Paciente');
const SintomasDB=require('../models/Sintoma');
const SignosDB=require('../models/Signo');
const PruebaLabDB=require('../models/pruebalab');
const PruebaMuerteDB=require('../models/pruebamuerte');
const EnfermedadDB=require('../models/Enfermedad');
const Enfermedad = require('../models/Enfermedad');
const pruebalab = require('../models/pruebalab');
async function ObetenerEnfermedades(){
  var enfermedadDB;
 enfermedadDB=await EnfermedadDB.find().lean();
  return enfermedadDB;
}
async function ObtenerSintomas(){
  var sintomasDB;
 sintomasDB=await SintomasDB.find().lean();
  return sintomasDB;
}
async function ObtenerSignos(){
  var signosDB;
 signosDB=await SignosDB.find().lean();
  return signosDB;
}

router.get('/consultas/agregar/:id',isAuthenticated,async (req,res)=>{
    const paciente =await PacienteDB.findById(req.params.id).lean();
    const sintomas=await SintomasDB.find().lean();
    const signos=await SignosDB.find().lean();
    const pruebalab=await PruebaLabDB.find().lean();
    res.render('CrudConsultas/agregar.hbs', {paciente,signos,sintomas,pruebalab});
  });
  //Agregar al DB
router.post('/CrudConsultas/agregar',isAuthenticated, async (req,res) => {
  const {Paciente,SintomasPa,SignosPa,PruebaLab,PruebaMuerte,ResultadoPruebaLab,ResultadoPruebaMuerte}=req.body;
  const errors=[];
  console.log("Sintomas del Paciente");
  if(!SintomasPa){
    errors.push({text:'Escriba sus Apellidos'});
  }
  if(!SignosPa){
    errors.push({text:'Escriba el NSS'});
  }
  if(errors.length>0){
    req.flash('error_msg', 'No deje Campos en Blanco');
      res.render('CrudConsultas/agregar',{
        errors,
        SignosPa,
        SintomasPa
      });
  }else{
    const NomEnfermedad=[];
    const PorcentajeFinal=[];
    var band=0;
      // const enfermedadDB=await EnfermedadDB.find().lean();
       const enfermedadDB=await ObetenerEnfermedades();
    //  console.log(enfermedadDB);
      const TodosSintomasDB=await ObtenerSintomas();
      //  console.log("Signos DE la Base de datos",sintomasDB);
      const TodosSignosDB=await ObtenerSignos();
       var auxPorcentaje=0;
       enfermedadDB.forEach  (enfermedadDB => 
        {
             enfermedadDB.Signos.forEach(Signos=>
              {
                SignosPa.forEach(async SignosPa=>
                {
                  if(SignosPa==Signos)
                  {
                    band =1;
                    TodosSignosDB.forEach(todosSigno=>{
                        if(Signos==todosSigno.Nombre){
                          auxPorcentaje += todosSigno.Importancia;
                        }
                    });                    
                  }
                });
             });
            enfermedadDB.Sintomas.forEach(Sintomas=>
              {
                SintomasPa.forEach(async SintomasPa=>
                {
                  if(SintomasPa==Sintomas)
                  {
                    TodosSintomasDB.forEach(todosSintoma=>{
                      if(Sintomas==todosSintoma.Nombre){
                        band =1;
                        auxPorcentaje += todosSintoma.Importancia;
                      }
                  });
                  }
                });
             });
             if(band == 1)
             {
               band = 0;
              NomEnfermedad.push(enfermedadDB.Enfermedad);
              PorcentajeFinal.push(auxPorcentaje);
             }
             auxPorcentaje = 0;
       });
       const Enfermedades=[];
       ///////Derterminando las 3 Enfermedades/////
       var cont=0;
       var enfermedadTop,enfermedadMid,enfermedadBot;
       var porcentajeTop=0,porcentajeMid=0,porcentajeBot=0;
       NomEnfermedad.forEach(enfermedad=>{
              if(cont==0){
                enfermedadTop=enfermedad;
                porcentajeTop=PorcentajeFinal[cont];
              }else  if(cont==1)
              {
                  if (porcentajeTop<PorcentajeFinal[cont])
                  {
                      enfermedadMid=enfermedadTop;
                      enfermedadTop=enfermedad;
                      porcentajeMid=porcentajeTop;
                      porcentajeTop=PorcentajeFinal[cont];
                                      
                  }else 
                  {
                    enfermedadMid=enfermedad;
                    porcentajeMid=PorcentajeFinal[cont];
           
                  }
              }else if(porcentajeTop<PorcentajeFinal[cont])
              {
                enfermedadBot=enfermedadMid;
                enfermedadMid=enfermedadTop;  
                enfermedadTop=enfermedad;
                porcentajeBot=porcentajeMid;
                porcentajeMid=porcentajeTop;
                porcentajeTop=PorcentajeFinal[cont];
              }else if(porcentajeMid<PorcentajeFinal[cont])
                {
                  porcentajeBot=porcentajeMid;
                  porcentajeMid=PorcentajeFinal[cont];
                  enfermedadBot=enfermedadMid;
                  enfermedadMid=enfermedad;

                }else if (porcentajeBot<PorcentajeFinal[cont])
                {
                    porcentajeBot=PorcentajeFinal[cont];
                    enfermedadBot=enfermedad;
                }
        cont++;
       });  
       Enfermedades.push(enfermedadTop);
       Enfermedades.push(enfermedadMid);
       Enfermedades.push(enfermedadBot);
      const newConsulta=new ConsultaDB({Paciente,SintomasPa,SignosPa,PruebaLab,PruebaMuerte,Enfermedades,ResultadoPruebaLab,ResultadoPruebaMuerte});
     await newConsulta.save();
     const pruebalab=await PruebaLabDB.find().lean();
     const pruebamuerte=await PruebaMuerteDB.find().lean();

     req.flash('success_msg', 'Enfermedad Agregado Correctamente');
      res.render('CrudConsultas/resultadoConsulta',{newConsulta,pruebalab,pruebamuerte});
  }
});
router.post('/CrudConsultas/result', async (req,res)=>{
  const {_id,PruebaLab,PruebaMuerte,ResultPruebaLab,ResultPruebaMuerte}=req.body;
  const errors=[];
  const consulta= await ConsultaDB.findById(_id).lean();
  const Enfermedades=[];
    req.flash('success_msg', 'Se termino la Consulta');
    consulta.Enfermedades.forEach(enfermedad=>{
      console.log("enfermedad en el for",enfermedad);
      if(enfermedad=="Cancer de Prostata"){
        if(PruebaLab=="Biopsia de la prostata"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="Cancer de Prostata"){
              Enfermedades.push(element);
              }
            });
          }else {
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="VIH SIDA"){
        console.log("VIH Entro",pruebalab);
        if(PruebaLab=="Prueba de PSA en sangre"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="VIH SIDA"){
              Enfermedades.push(element);
              }
            });
          }else{
            console.log("entro en el Else",enfermedad);
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="Diabetes 2"){
        if(PruebaLab=="Glucosa plasmatica en ayunas"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach.forEach(element=>{
              if(element!="Diabetes 2"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="Diabetes 3"){
        if(PruebaLab=="Glucosa plasmatica en ayunas"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="Diabetes 3"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="Diabetes Tipo 1"){
        if(PruebaLab=="Glucosa plasmatica en ayunas"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="Diabetes Tipo 1"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="Hipertiroidismo"){
        if(PruebaLab=="TSH"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="Hipertiroidismo"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="Hepatitis"){
        if(PruebaLab=="Pruebas de anticuerpos y antigenos"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="Pruebas de anticuerpos y antigenos"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="Meningitis"){
        if(PruebaLab=="Neuroimagen"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="Neuroimagen"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }else if(enfermedad=="apendicitis"){
        if(PruebaLab=="Ultrasonido Pelvico"){
          if(ResultPruebaLab=="Negativo"){
            consulta.Enfermedades.forEach(element=>{
              if(element!="apendicitis"){
              Enfermedades.push(element);
              }
            });
          }else{
            Enfermedades.push(enfermedad);
          }
        }
      }
      
    });

    await ConsultaDB.findByIdAndUpdate(_id, {PruebaLab,PruebaMuerte,ResultPruebaLab,ResultPruebaMuerte,Enfermedades});
    res.redirect('/pacientes/mostrar');
 
});
///Pagina Historial
router.get('/historial',isAuthenticated, async(req,res)=>{
  const pacientes=await PacienteDB.find().lean();
  res.render('CrudConsultas/Historial',{pacientes});
});

///Historial Por Paciente
router.get('/historial/:id',isAuthenticated,async (req,res)=>{
  const paciente =await PacienteDB.findById(req.params.id).lean();
  const consultas =await ConsultaDB.aggregate(
    [
      {
        $lookup:
        {
          from: "pacientes",
          localField: "Paciente",
          foreignField: "_id",
          as: "pacienteConsulta"
        }
      },
      { $unwind: "$pacienteConsulta"},
      { $match: {_id: (req.params.id).toString}}
    ]
  )
  res.render('CrudConsultas/mostrarHistorial', {paciente,consultas});
});
  module.exports=router;