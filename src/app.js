import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import mongoose from './config/database.js';
import MongoStore from 'connect-mongo';
import sessionsRouter from './routes/api/SessionController.js';

import cartsRouter from './routes/api/CartController.js'
import productsRouter from './routes/api/ProductController.js'

import viewsRouter from './routes/ViewController.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import dotenv from 'dotenv'
import {isNotAuthenticated} from "./middleware/auth.js";
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('src/public'));

app.engine('handlebars', engine({
    extname: '.handlebars',
    defaultLayout: null,
    runtimeOptions: {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(process.env.SECRET_KEY));

app.use(session({
    secretKey: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        ttl: 15 * 60
    }),
    cookie: { secure: false }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/users', viewsRouter);

app.get('/', isNotAuthenticated, (req, res) => {
    res.render('main')
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
