const express = require("express");
const path = require("path");
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport =require('passport');
const flash=require('connect-flash');
// npm i express express-handlebars express-session method-override moongose passport nodemon
//Initializations
const app =express();
require('./database');
require('./config/passport');
// Settings 
app.set('port',process.env.PORT||3000);
app.set('views',path.join(__dirname,'views'));

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    runtimeOptions: {                           
        allowProtoPropertiesByDefault: true,
        // allowProtoMethodsByDefault: true
    },
    extname: '.hbs',
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret:'1234',
    resave: 'true',
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//Global Variables
app.use((req,res,next)=>{
    res.locals.success_msg =req.flash('success_msg');
    res.locals.error_msg =req.flash('error_msg');
    res.locals.error =req.flash('error');
    res.locals.user=req.user||null;
    next();
});
//Routes 
app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/CrudPacientes'));
app.use(require('./routes/CrudEnfermedades'));
app.use(require('./routes/CrudPruebasLab'));
app.use(require('./routes/CrudSignos'));
app.use(require('./routes/CrudSintomas'));
app.use(require('./routes/CrudPruebasMuerte'));
app.use(require('./routes/CrudConsultas'));
//Static Files
app.use(express.static(path.join(__dirname,'public')));
//Server is listenning
app.listen(app.get('port'),()=>{
    console.log('Server on port ',app.get('port'));
});