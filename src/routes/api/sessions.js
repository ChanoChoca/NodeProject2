import { Router } from 'express';
import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv'
dotenv.config()

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
    res.send({ status: "success", message: "Usuario registrado" });
});

router.get('/failregister', async (req, res) => {
    console.log('Estrategia de registro fallida');
    res.send({ error: "Failed" });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales inválidas" });

    // Generar el JWT
    const token = jwt.sign({ id: req.user._id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // const token = jwt.sign({ id: req.user._id, email: req.user.email, role: req.user.role }, 'jwtSecretKey', { expiresIn: '1h' });

    // Almacenar el JWT en una cookie firmada
    res.cookie('currentUser', token, { httpOnly: true, signed: true });

    // Redirigir a /current si el login es exitoso
    res.redirect('/users/current');
});

router.get('/faillogin', (req, res) => {
    res.send("Login fallido");
});

router.post('/logout', (req, res) => {
    res.clearCookie('currentUser');
    req.session.destroy(err => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/users/login');
    });
});

router.get('/current', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.send(req.user);
});

export default router;
