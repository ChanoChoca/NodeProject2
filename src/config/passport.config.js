import passport from "passport";
import local from 'passport-local';
import jwt from 'passport-jwt';
import User from '../models/user.js';
import Cart from '../models/cart.js';
import { isValidPassword } from "../utils.js";
import dotenv from 'dotenv';
dotenv.config();

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age, cartId } = req.body;
        try {
            let user = await User.findOne({ email: username });
            if (user) {
                console.log("El usuario ya existe");
                return done(null, false, { message: 'El usuario ya existe' });
            }

            let cart;
            if (cartId) {
                cart = cartId;
            } else {
                const newCart = await Cart.create({});
                cart = newCart._id;
            }

            const newUser = new User({
                first_name,
                last_name,
                email,
                age,
                password,
                cart
            });

            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            if (!user) {
                console.log("El usuario no existe");
                return done(null, false, { message: 'Credenciales inválidas' });
            }
            if (!isValidPassword(user, password)) return done(null, false, { message: 'Credenciales inválidas' });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([ExtractJWT.fromExtractors([req => req.signedCookies.currentUser])]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}

export default initializePassport;
