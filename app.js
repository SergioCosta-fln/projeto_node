const express = require('express');
const mustache = require('mustache-express');   // Template visual
const router = require('./routes/index');       // Rotas
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

// Controle de acesso
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Configurações
const app = express();

app.use(express.json());  // Trata agora as req via POST
app.use(express.urlencoded({extended:true}));

app.use(express.static(__dirname+'/public'));

//  Habilitando o Cookie
app.use(cookieParser(process.env.SECRET));

// Habilitando a seção
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

// Habilitando o flash
app.use(flash());

// Inicialzar o passport
app.use(passport.initialize());
app.use(passport.session());

// helpers antes da definição das rotas
app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user;
    next();
});



// Chamar o Model de User
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Antes das routas buscar o css
app.use('/', router);       // Definição das rotas 

app.use(errorHandler.notFound);

app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));

app.set('view engine', 'mst')                   // Motor visual que vai usar - pra que ele serve
app.set('views', __dirname + '/views');         // Define a pasta onde estão os layouts

module.exports = app;