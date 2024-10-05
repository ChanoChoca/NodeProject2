import { Router } from 'express';
import CartService from '../../services/CartService.js';
import { isUser } from "../../middleware/authorization.js";

const router = Router();

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await CartService.getAllCarts();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartService.getCartById(req.params.cid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// Crear un carrito
router.post('/', async (req, res) => {
    try {
        const cart = await CartService.createCart(req.body.products);
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Añadir un producto a un carrito específico
router.post('/:cid/products/:pid', isUser, async (req, res) => {
    try {
        const cart = await CartService.addProductToCart(req.params.cid, req.params.pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Eliminar un producto de un carrito específico
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await CartService.removeProductFromCart(req.params.cid, req.params.pid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// Actualizar el carrito completo
router.put('/:cid', async (req, res) => {
    try {
        const cart = await CartService.updateCart(req.params.cid, req.body.products);
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

// Eliminar el carrito completo
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await CartService.clearCart(req.params.cid);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
});

// Procesar la compra de un carrito
router.post('/:cid/purchase', isUser, async (req, res) => {
    try {
        const { ticket, unprocessedProducts } = await CartService.processPurchase(req.params.cid, req.user.email);
        res.status(200).json({ status: 'success', ticket, unprocessedProducts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
