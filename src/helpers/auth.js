const helpers={};
//La funcion de abajo permite bloqueras las vistas 
//a usuario no autorizados
helpers.isAuthenticated=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg', 'Not Autorized');
        res.redirect('/singin')
    }
};
module.exports=helpers;