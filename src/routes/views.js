// views.js
import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import Product from '../models/product.js';
import Cart from "../models/Cart.js";
import User from "../models/user.js";

const router = Router();

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/current', isAuthenticated, async (req, res) => {
    try {
        // Verificar si `req.user` tiene el campo _id
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized');
        }
        // Poblar el carrito del usuario
        const user = await User.findById(req.user.id).populate('cart').lean();
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('current', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/faillogin', (req, res) => {
    res.render('faillogin');
});

router.get('/carts/:cid', isAuthenticated, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized');
        }

        // Encuentra al usuario y pobla el carrito y los productos en el carrito
        const user = await User.findById(req.user.id)
            .populate({
                path: 'cart',
                populate: {
                    path: 'products.product',
                    model: 'Product'
                }
            })
            .lean();

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Asegúrate de que user.cart y user.cart.products estén definidos
        res.render('cart', { user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/products', isAuthenticated, async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', category = '', availability = '' } = req.query;
        const limitNumber = parseInt(limit, 10) || 10;
        const pageNumber = parseInt(page, 10) || 1;

        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
        const queryOption = {};
        if (category) {
            queryOption.category = { $regex: category.trim(), $options: 'i' };
        }
        if (availability) {
            queryOption.status = availability === 'true';
        }

        const options = {
            page: pageNumber,
            limit: limitNumber,
            sort: sortOption
        };

        const result = await Product.paginate(queryOption, options);

        // Poblar el carrito del usuario autenticado
        const user = await User.findById(req.user.id).populate('cart').lean();

        res.render('products', {
            products: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limitNumber}&page=${result.prevPage}&sort=${sort}&category=${category}&availability=${availability}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limitNumber}&page=${result.nextPage}&sort=${sort}&category=${category}&availability=${availability}` : null,
            user // Asegurarse de pasar el usuario a la vista
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/products/:pid', isAuthenticated, async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Obtener el usuario autenticado y su carrito
        const user = await User.findById(req.user.id).populate('cart').lean();

        res.render('product', {
            product,
            user // Pasa el usuario y su carrito a la vista
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
