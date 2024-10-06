import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/users/register' }), async (req, res) => {
    res.redirect('/users/login');
});

router.get('/failregister', async (req, res) => {
    console.log('Estrategia de registro fallida');
    res.send({ error: "Failed" });
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/users/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales inválidas" });

    const token = jwt.sign({ id: req.user._id, email: req.user.email, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('currentUser', token, { httpOnly: true, signed: true });

    res.redirect('/users/current');
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

import UserService from '../../services/UserService.js';

/**
 *
 * Modifica el rol de un usuario.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 * "newRole": "admin"
 * }
 *
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { newRole } = req.body;

    try {
        const updatedUser = await UserService.updateUserRole(id, newRole);
        res.send({ status: "success", message: "Rol actualizado correctamente", user: updatedUser });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
