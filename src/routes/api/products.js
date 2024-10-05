import { Router } from 'express';
import Product from '../../models/product.js';
import {isAdmin} from "../../middleware/authorization.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const limitNumber = parseInt(limit, 10) || 10;
        const pageNumber = parseInt(page, 10) || 1;

        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const queryOption = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};

        const options = {
            page: pageNumber,
            limit: limitNumber,
            sort: sortOption
        };

        const result = await Product.paginate(queryOption, options);

        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limitNumber}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limitNumber}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/', isAdmin, async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
            return res.status(400).json({ status: 'error', message: 'Invalid input data' });
        }

        const newProduct = new Product({ title, description, code, price, stock, category, thumbnails });
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', isAdmin, async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
            return res.status(400).json({ status: 'error', message: 'Invalid input data' });
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true, runValidators: true });

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.pid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
