const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const bcrypt= require('bcryptjs');
const User = require('../models/Users');
/* verifica si los datos ingresados para el inicio de sesion 
 Son correctos*/
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField:'password',
},async (email, password, done)=>{
  const user=  await User.findOne({email: email});
  if(!user){
      return done(null,false,{message: 'Usuario Incorrecto'})
  }else{
      const match = await bcrypt.compare(password, user.password);
        if(match){
            return done(null,user);
        }else{
            return done(null, false, {message: 'Constraseña Incorrecta'})
        }
    }
}));
//Las dos funciones de abajo me ayudan que usuario esta conecta
passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser((id,done)=>{
User.findById(id,(err,user)=>{
    done(err,user); 
 });
});