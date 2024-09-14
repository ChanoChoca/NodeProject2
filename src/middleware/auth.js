import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const isAuthenticated = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) {
        console.log('Token no encontrado');
        return res.redirect('/users/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Error al verificar el token:', err);
            res.clearCookie('currentUser');
            return res.redirect('/users/login');
        }

        // Asegúrate de asignar el ID al req.user
        req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
        next();
    });
};

export const isNotAuthenticated = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) return next();

    return res.redirect('/users/current');
};
