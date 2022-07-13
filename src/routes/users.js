const { escapeRegExpChars } = require('ejs/lib/utils');
const express=require('express');
const router =express.Router();
const passport=require('passport');
const User=require('../models/Users');
router.get('/singin',(req, res)=>{
    res.render ('users/singin');
});
//Autenticacion del usuario
router.post('/singin',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/singin',
  failureFlash: true
}));
//Agregando la ruta ingresar
router.get('/singup',(req, res)=>{
    res.render ('users/singup');
});
//Registrar Usuario
router.post('/users/singup',async (req,res) => {
  const {Nombre,Apellido,email,password,TipoUsuario}=req.body;
  const errors=[];
  if(!Nombre){
    errors.push({text:'Escriba un Nombre'});
  }
  if(!Apellido){
    errors.push({text:'Escriba sus Apellidos'});
  }
  if(!email){
    errors.push({text:'Escriba un Nombre de Usuario'});
  }
  if(!password){
    errors.push({text:'Escriba una Contraseña'});
  }
  if(TipoUsuario=="Seleccione un Usuario"){
    errors.push({text:'Eliga un Tipo de Usuario'});
  }
  if(errors.length>0){
      res.render('users/singup',{
          errors,
          Nombre,
          Apellido,
          Usuario,
          
      });
  }else{
    //comprobando que el correo no este repetido
    const emailUser=await User.findOne({email:email});
    
    if(emailUser){
      errors.push({text:'problema'});
      req.flash('error_msg','El Correo ya Existe');
      res.render('users/singup',{errors});
    }else{
      const newUser=new User({Nombre,Apellido,email,password,TipoUsuario});
      newUser.password=await newUser.encryptPassword(password);
     await newUser.save();
     req.flash('success_msg','Se ha Registrado Correctamente')
      res.redirect('/singin')
    }
  }
});
//Ayuda a cerrar sesion del usuario
router.get('/logout', (req,res)=>{
  req.logOut();
  res.redirect('/singin');
});

module.exports=router;