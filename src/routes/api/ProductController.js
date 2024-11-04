import { Router } from 'express';
import ProductService from '../../services/ProductService.js';
import { isAdmin } from '../../middleware/authorization.js';

const router = Router();

/**
 *
 * Lista todos los productos de la base.
 *
 */
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
            sort: sortOption,
        };

        const result = await ProductService.getAllProducts(queryOption, options);

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

/**
 *
 * Trae sólo el producto con el id proporcionado.
 *
 */
router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(error.message === 'Product not found' ? 404 : 500).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Agrega un nuevo producto con los campos.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *     "title": "Product",
 *     "description": "Descripción del producto",
 *     "code": "PROD001",
 *     "price": 25,
 *     "stock": 10,
 *     "category": "Categoria",
 *     "thumbnails": ["https://cdn.pixabay.com/photo/2023/07/27/11/42/mountain-8153221_1280.jpg", "https://images.unsplash.com/photo-1721332154191-ba5f1534266e?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
 * }
 */
router.post('/', isAdmin, async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
            return res.status(400).json({ status: 'error', message: 'Invalid input data' });
        }

        const newProduct = await ProductService.createProduct({ title, description, code, price, stock, category, thumbnails });

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Toma un producto y lo actualiza por los campos enviados desde body. NUNCA se actualiza o elimina el id al momento de hacer dicha actualización.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *     "title": "Product",
 *     "description": "Descripción del producto",
 *     "code": "PROD001",
 *     "price": 100,
 *     "stock": 10,
 *     "category": "Categoria",
 *     "thumbnails": ["https://cdn.pixabay.com/photo/2023/07/27/11/42/mountain-8153221_1280.jpg", "https://images.unsplash.com/photo-1721332154191-ba5f1534266e?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]
 * }
 */
router.put('/:pid', isAdmin, async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
            return res.status(400).json({ status: 'error', message: 'Invalid input data' });
        }

        const updatedProduct = await ProductService.updateProduct(req.params.pid, req.body);

        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Elimina el producto con el pid indicado.
 *
 */
router.delete('/:pid', isAdmin, async (req, res) => {
    try {
        await ProductService.deleteProduct(req.params.pid);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
