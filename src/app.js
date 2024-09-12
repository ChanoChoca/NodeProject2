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
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
// const PORT = 3000;

app.engine('handlebars', engine({
    extname: '.handlebars',
    defaultLayout: null
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser(process.env.SECRET_KEY));

app.use(session({
    secretKey: process.env.SECRET_KEY,
    // secretKey: 'secretKey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        // mongoUrl: 'mongodb+srv://juanicaprioli16:RTQ0YzrJefi4z19y@cluster0.vzzl3.mongodb.net/integrative_practise?retryWrites=true&w=majority'
        mongoUrl: process.env.MONGO_URL,
        ttl: 15 * 60
    }),
    cookie: { secure: false }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/sessions', sessionsRouter);
app.use('/users', viewsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
