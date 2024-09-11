import jwt from 'jsonwebtoken';

/**
 * Middleware para verificar si el usuario está autenticado.
 * Comprueba el token JWT en las cookies firmadas.
 * Si el token es válido, lo decodifica y agrega la información del usuario a `req.user`.
 * Redirige a '/users/login' si el token no es válido o está ausente.
 */
export const isAuthenticated = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) return res.redirect('/users/login');

    jwt.verify(token, 'secretKey', (err, decoded) => {
        if (err) {
            res.clearCookie('currentUser');
            return res.redirect('/users/login');
        }

        req.user = decoded;
        next();
    });
};

/**
 * Middleware para verificar si el usuario no está autenticado.
 * Comprueba el token JWT en las cookies firmadas.
 * Si el token está presente, redirige al usuario a '/users/current'.
 * Si no hay token, permite continuar con la solicitud.
 */
export const isNotAuthenticated = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) return next();

    return res.redirect('/users/current');
};
