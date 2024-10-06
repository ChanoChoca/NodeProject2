import { Router } from 'express';
import CartService from '../../services/CartService.js';
import { isUser } from "../../middleware/authorization.js";

const router = Router();

/**
 *
 * Lista los productos que pertenezcan al carrito.
 *
 */
router.get('/', async (req, res) => {
    try {
        const carts = await CartService.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Lista los productos que pertenezcan al carrito con el parámetro cid proporcionados.
 *
 */
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartService.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
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
        const cart = await CartService.createCart(req.body.products);
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Agrega el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato.
 * No necesita body json. Si se quiere probar en Postman, eliminar 'isUser'
 *
 */
router.post('/:cid/products/:pid', isUser, async (req, res) => {
    try {
        const cart = await CartService.addProductToCart(req.params.cid, req.params.pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
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
        const cart = await CartService.removeProductFromCart(req.params.cid, req.params.pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Actualiza el carrito con un arreglo de productos con el formato especificado arriba.
 *
 * A diferencia del endpoint '/:cid/products/:pid', en este endpoint si hay otros productos en el carrito, los elimina.
 * Si se quiere probar en Postman, eliminar 'isUser'
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
router.put('/:cid', isUser, async (req, res) => {
    try {
        const cart = await CartService.updateCart(req.params.cid, req.body.products);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
 *
 * El formato por Postman, por ejemplo, debe ser el siguiente:
 * {
 *   "quantity": 5
 * }
 */
router.put('/:cid/products/:pid', isUser, async (req, res) => {
    try {
        const { quantity } = req.body;

        // Validate the quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({ status: 'error', message: 'A valid quantity is required' });
        }

        // Call the service to update the product quantity
        const updatedCart = await CartService.updateProductQuantity(req.params.cid, req.params.pid, quantity);

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Elimina todos los productos del carrito
 *
 */
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartService.clearCart(req.params.cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

/**
 *
 * Procesar la compra de un carrito
 *
 */
router.post('/:cid/purchase', isUser, async (req, res) => {
    try {
        const { ticket, unprocessedProducts } = await CartService.processPurchase(req.params.cid, req.user.email);
        res.status(200).json({ status: 'success', ticket, unprocessedProducts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
