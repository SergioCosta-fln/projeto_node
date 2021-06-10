const express = require('express');
const mustache = require('mustache-express');   // Template visual
const router = require('./routes/index');       // Rotas
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
//const cookieParser = require('cookie-parse');
const session = require('express-session');
const flash = require('express-flash');

// Configurações
const app = express();

// helpers antes da definição das rotas
app.use((req, res, next) => {
    res.locals.h = helpers;
    next();
});

app.use(express.json());  // Trata agora as req via POST
app.use(express.urlencoded({extended:true}));

//app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use('/', router);       // Definição das rotas 

app.use(errorHandler.notFound);

app.engine('mst', mustache(__dirname + '/views/partials', '.mst'));

app.set('view engine', 'mst')                   // Motor visual que vai usar - pra que ele serve
app.set('views', __dirname + '/views');         // Define a pasta onde estão os layouts

module.exports = app;