import { Router } from 'express';
import Cart from '../../models/cart.js';
import Product from '../../models/product.js';

const router = Router();

/**
 *
 * Lista los productos que pertenezcan al carrito. VER
 *
 */
router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching carts', error: error.message });
    }
});

/**
 *
 * Lista los productos que pertenezcan al carrito con el parámetro cid proporcionados.
 *
 * El _id del carrito es: 66b16aa3a5164ce39074e7b5
 *
 */
router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ status: 'error', message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching cart', error: error.message });
    }
});

/**
 *
 * Crea un nuevo carrito con la siguiente estructura.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *   "products": [
 *     {
 *       "product": "66accb55ea9c8230040fa023",
 *       "quantity": 10
 *     }
 *   ]
 * }
 */
router.post('/', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'Products array is required' });
        }

        for (const { product, quantity } of products) {
            if (!product || !quantity || quantity < 1) {
                return res.status(400).json({ status: 'error', message: 'Product ID and a valid quantity are required' });
            }

            const productExists = await Product.findById(product);
            if (!productExists) {
                return res.status(404).json({ status: 'error', message: `Product with ID ${product} not found` });
            }
        }

        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ products: [] });
        }

        for (const { product, quantity } of products) {
            const productIndex = cart.products.findIndex(item => item.product.toString() === product);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product, quantity });
            }
        }

        await cart.save();
        res.status(200).json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal Server Error', error: error.message });
    }
});

/**
 *
 * Agrega el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *   "products": [
 *     {
 *       "product": "66accb55ea9c8230040fa023",
 *       "quantity": 10
 *     }
 *   ]
 * }
 */
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Product not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Error adding product to cart', error: error.message });
    }
});


/**
 *
 * Elimina del carrito el producto seleccionado.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *   "products": [
 *     {
 *       "product": "66accb55ea9c8230040fa023",
 *       "quantity": 10
 *     }
 *   ]
 * }
 */
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }

        cart.products.splice(productIndex, 1);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error removing product from cart', error: error.message });
    }
});

/**
 *
 * Actualiza el carrito con un arreglo de productos con el formato especificado arriba.
 *
 * A diferencia del endpoint '/:cid/products/:pid', en este endpoint si hay otros productos en el carrito, los elimina.
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *   "products": [
 *     {
 *       "product": "66accb55ea9c8230040fa023",
 *       "quantity": 10
 *     }
 *   ]
 * }
 */
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ status: 'error', message: 'Products array is required' });
        }

        for (const { product, quantity } of products) {
            if (!product || !quantity || quantity < 1) {
                return res.status(400).json({ status: 'error', message: 'Product ID and a valid quantity are required' });
            }

            const productExists = await Product.findById(product);
            if (!productExists) {
                return res.status(404).json({ status: 'error', message: `Product with ID ${product} not found` });
            }
        }

        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        cart.products = products;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error updating cart', error: error.message });
    }
});

/**
 *
 * Actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *     "product": "66accb55ea9c8230040fa023",
 *     "quantity": 10
 * }
 */
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'A valid quantity is required' });
        }

        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
        if (productIndex === -1) {
            return res.status(404).json({ status: 'error', message: 'Product not found in cart' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error updating product quantity', error: error.message });
    }
});

/**
 *
 * Elimina todos los productos del carrito
 *
 */
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        cart.products = [];
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error clearing cart', error: error.message });
    }
});

export default router;
