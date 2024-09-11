import { Router } from 'express';
import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = Router();

/**
 * Ruta POST para el registro de un nuevo usuario.
 * Usa la estrategia de autenticación 'register' de Passport.
 * Redirige a '/failregister' en caso de fallo.
 */
router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" });
});

/**
 * Ruta GET para manejar fallos en el registro.
 * Muestra un mensaje de error en caso de fallos en la estrategia de registro.
 */
router.get('/failregister', async (req, res) => {
    console.log('Estrategia de registro fallida');
    res.send({ error: "Failed" });
});

/**
 * Ruta POST para el inicio de sesión del usuario.
 * Usa la estrategia de autenticación 'login' de Passport.
 * Genera un JWT, lo almacena en una cookie y redirige a '/users/current' si el login es exitoso.
 * Redirige a '/faillogin' en caso de fallo.
 */
router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales inválidas" });

    // Generar el JWT
    const token = jwt.sign({ id: req.user._id, email: req.user.email, role: req.user.role }, 'secretKey', { expiresIn: '1h' });

    // Almacenar el JWT en una cookie firmada
    res.cookie('currentUser', token, { httpOnly: true, signed: true });

    // Redirigir a /current si el login es exitoso
    res.redirect('/users/current');
});

/**
 * Ruta GET para manejar fallos en el inicio de sesión.
 * Muestra un mensaje de error en caso de fallo en la estrategia de inicio de sesión.
 */
router.get('/faillogin', (req, res) => {
    res.send("Login fallido");
});

/**
 * Ruta POST para cerrar sesión del usuario.
 * Elimina la cookie de JWT y destruye la sesión.
 * Redirige a '/users/login' después de cerrar sesión.
 */
router.post('/logout', (req, res) => {
    res.clearCookie('currentUser');
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/users/login');
    });
});

export default router;
