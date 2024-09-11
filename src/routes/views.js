import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();

/**
 * Ruta GET para la página de inicio de sesión.
 * Usa el middleware `isNotAuthenticated` para asegurar que solo usuarios no autenticados puedan acceder.
 */
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

/**
 * Ruta GET para la página de usuario actual.
 * Usa el middleware `isAuthenticated` para asegurar que solo usuarios autenticados puedan acceder.
 * Pasa el objeto `user` a la vista para mostrar la información del usuario.
 */
router.get('/current', isAuthenticated, (req, res) => {
    res.render('current', { user: req.user });
});

export default router;
