import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import mongoose from './config/database.js';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/api/sessions.js';
import viewsRouter from './routes/views.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

const app = express();
const PORT = 3000;

/**
 * Configura el motor de plantillas Handlebars para Express.
 * Usa el archivo .handlebars como extensión para las vistas.
 */
app.engine('handlebars', engine({
    extname: '.handlebars',
    defaultLayout: null
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

/**
 * Middleware para analizar datos de formularios URL-encoded y JSON.
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Middleware para analizar cookies y firmarlas con una clave secreta.
 */
app.use(cookieParser('secretKey')); // <-- Agregar esto

/**
 * Configura el middleware de sesión usando express-session y conectándolo con MongoDB.
 * Utiliza la URI de conexión para almacenar sesiones en MongoDB.
 */
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://juanicaprioli16:RTQ0YzrJefi4z19y@cluster0.vzzl3.mongodb.net/integrative_practise?retryWrites=true&w=majority'
    })
}));

/**
 * Inicializa Passport para la autenticación.
 */
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

/**
 * Configura las rutas para las sesiones y las vistas.
 */
app.use('/api/users', sessionsRouter);
app.use('/users', viewsRouter);

/**
 * Inicia el servidor en el puerto especificado y muestra un mensaje en la consola.
 */
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
