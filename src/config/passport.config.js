import passport from "passport";
import local from 'passport-local';
import jwt from 'passport-jwt';
import userService from '../models/user.js';
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
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await userService.findOne({ email: username });
                if (user) {
                    console.log("El usuario existe");
                    return done(null, false);
                }

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password
                };

                let result = await userService.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            }
        }
    ));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userService.findOne({ email: username });
            if (!user) {
                console.log("El usuario no existe");
                return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([(req) => req.signedCookies.currentUser]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await userService.findById(jwt_payload.id);
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
        let user = await userService.findById(id);
        done(null, user);
    });
}

export default initializePassport;
