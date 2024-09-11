import passport from "passport";
import local from 'passport-local';
import userService from '../models/user.js'; // Servicio de usuario para interactuar con la base de datos
import { createHash, isValidPassword } from "../utils.js"; // Utilidades para manejar contraseñas

const LocalStrategy = local.Strategy;

/**
 * Configura Passport para la autenticación.
 * Define las estrategias de registro y de inicio de sesión utilizando Passport.
 */
const initializePassport = () => {

    /**
     * Estrategia de registro utilizando Passport.
     * Verifica si el usuario ya existe.
     * Si no existe, crea un nuevo usuario con la contraseña hasheada.
     */
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
                    password: createHash(password) // Hashea la contraseña antes de guardarla
                };

                let result = await userService.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            }
        }
    ));

    /**
     * Serializa el usuario almacenando solo su ID en la sesión.
     */
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    /**
     * Deserializa el usuario recuperando la información completa del usuario usando su ID.
     */
    passport.deserializeUser(async (id, done) => {
        let user = await userService.findById(id);
        done(null, user);
    });

    /**
     * Estrategia de inicio de sesión utilizando Passport.
     * Verifica la existencia del usuario y valida la contraseña.
     */
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
}

export default initializePassport;
