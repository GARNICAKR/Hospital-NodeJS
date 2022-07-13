const express=require('express');
const router =express.Router();
const {isAuthenticated}=require('../helpers/auth');
//Paginas de Navegacion
router.get ('/',(req, res)=>{
    res.render('Navigation/index', {title: 'Proyecto Final'});
});
router.get ('/pacientes',isAuthenticated,(req, res)=>{
    res.render('Navigation/pacientes',{title: 'Paciente'});
});
router.get ('/signos',isAuthenticated,(req, res)=>{
    res.render('Navigation/signos',{title: 'Signos'});
});
router.get ('/prueba-laboratorio',isAuthenticated,(req, res)=>{
    res.render('Navigation/pruebaslaboratorios',{title: 'Pruebas de Laboratorio'});
});
router.get ('/sintomas',isAuthenticated,(req, res)=>{
    res.render('Navigation/sintomas', {title: 'Sintomas'});
});
router.get ('/prueba-muerte',isAuthenticated,(req, res)=>{
    res.render('Navigation/pruebamuerte',{title: 'Pruebas Muerte'});
});
router.get ('/enfermedad',isAuthenticated,(req, res)=>{
    res.render('Navigation/enfermedades',{title: 'Enfermedades'});
});
router.get ('/consultas',isAuthenticated,(req, res)=>{
    res.render('Navigation/consultas',Consultas);
});


module.exports=router;