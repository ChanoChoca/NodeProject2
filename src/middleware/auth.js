import jwt from 'jsonwebtoken';

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

export const isNotAuthenticated = (req, res, next) => {
    const token = req.signedCookies.currentUser;
    if (!token) return next();

    return res.redirect('/users/current');
};
