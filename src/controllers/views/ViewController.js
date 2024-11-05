import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated } from '../../middleware/auth.js';
import ProductService from '../../services/ProductService.js';
import UserRepository from '../../repository/UserRepository.js';
import UserDTO from "../../dto/UserDTO.js";

const router = Router();

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/current', isAuthenticated, async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).send('Unauthorized');
        }

        const user = await UserRepository.getUserById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const userDTO = new UserDTO(user);

        res.render('current', { user: userDTO, cart: user.cart });
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

        const user = await UserRepository.getUserById(req.user.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

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

        const result = await ProductService.getAllProducts(queryOption, options);

        const user = await UserRepository.getUserById(req.user.id);

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
            user
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/products/:pid', isAuthenticated, async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        const user = await UserRepository.getUserById(req.user.id);

        res.render('product', {
            product,
            user
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
