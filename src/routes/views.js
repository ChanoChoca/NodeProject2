import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const router = Router();

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/current', isAuthenticated, (req, res) => {
    res.render('current', { user: req.user });
});

router.get('/faillogin', (req, res) => {
    res.render('faillogin')
});

export default router;
