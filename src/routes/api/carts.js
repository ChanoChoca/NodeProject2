import { Router } from 'express';
import Cart from '../../models/cart.js';
import Product from '../../models/product.js';
import {isUser} from "../../middleware/authorization.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product');
        res.json(carts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error fetching carts', error: error.message });
    }
});

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

router.post('/:cid/products/:pid', isUser, async (req, res) => {
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

import Ticket from '../../models/ticket.js';
import CartDAO from '../../dao/CartDAO.js';
import nodemailer from 'nodemailer'
import dotenv from "dotenv";
dotenv.config()

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_GMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

//TODO: verificar
router.post('/:cid/purchase', isUser, async (req, res) => {
    try {
        const cart = await CartDAO.findById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Cart not found' });
        }

        let totalAmount = 0;
        const unprocessedProducts = [];

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                totalAmount += product.price * item.quantity;
                await product.save();
            } else {
                unprocessedProducts.push(item.product._id);
            }
        }

        const ticket = new Ticket({
            code: `TICKET-${Date.now()}`,
            amount: totalAmount,
            purchaser: req.user.email
        });

        await ticket.save();

        cart.products = cart.products.filter(item => unprocessedProducts.includes(item.product._id));
        await cart.save();

        // Send email notification
        try {
            await transport.sendMail({
                from: process.env.USER_GMAIL,
                to: req.user.email,
                subject: 'Purchase Confirmation',
                html: `
                <div>
                    <h1>Thank you for your purchase!</h1>
                    <p>Your purchase code is: ${ticket.code}</p>
                    <p>Total amount: $${totalAmount}</p>
                </div>
            `,
                attachments: []
            });
        } catch (emailError) {
            return res.status(500).json({ status: 'error', message: 'Purchase completed, but failed to send confirmation email. Please check your email address.' });
        }

        res.status(200).json({ status: 'success', ticket, unprocessedProducts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error processing purchase', error: error.message });
    }
});

export default router;
