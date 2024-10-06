import CartRepository from '../repository/CartRepository.js';
import ProductRepository from '../repository/ProductRepository.js';
import EmailService from "./EmailService.js";

class CartService {
    async getAllCarts() {
        try {
            return await CartRepository.getAllCarts();
        } catch (error) {
            throw new Error('Error fetching carts: ' + error.message);
        }
    }

    async getCartById(cid) {
        try {
            const cart = await CartRepository.getCartById(cid);
            if (!cart) {
                throw new Error('Cart not found');
            }
            return cart;
        } catch (error) {
            throw new Error('Error fetching cart: ' + error.message);
        }
    }

    async createCart(products) {
        try {
            if (!products || !Array.isArray(products)) {
                throw new Error('Products array is required');
            }
            let cart = await CartRepository.createCart({ products: [] });
            for (const { product, quantity } of products) {
                await this.addProductToCart(cart._id, product, quantity);
            }
            return cart;
        } catch (error) {
            throw new Error('Error creating cart: ' + error.message);
        }
    }

    async addProductToCart(cid, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
            const product = await ProductRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId.toString());
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await CartRepository.updateCart(cart._id, cart);
            return cart;
        } catch (error) {
            throw new Error('Error adding product to cart: ' + error.message);
        }
    }

    async removeProductFromCart(cid, productId) {
        try {
            const cart = await this.getCartById(cid);
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId.toString());
            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }
            cart.products.splice(productIndex, 1);
            await CartRepository.updateCart(cid, cart);
            return cart;
        } catch (error) {
            throw new Error('Error removing product from cart: ' + error.message);
        }
    }

    async updateCart(cid, products) {
        try {
            if (!products || !Array.isArray(products)) {
                throw new Error('Products array is required');
            }
            const cart = await this.getCartById(cid);
            cart.products = products;
            await CartRepository.updateCart(cid, cart);
            return cart;
        } catch (error) {
            throw new Error('Error updating cart: ' + error.message);
        }
    }

    async clearCart(cid) {
        try {
            const cart = await this.getCartById(cid);
            cart.products = [];
            await CartRepository.updateCart(cid, cart);
            return cart;
        } catch (error) {
            throw new Error('Error clearing cart: ' + error.message);
        }
    }

    async processPurchase(cid, userEmail) {
        try {
            const cart = await this.getCartById(cid);
            let totalAmount = 0;
            const unprocessedProducts = [];
            const productDetails = [];

            for (const item of cart.products) {
                const product = await ProductRepository.getProductById(item.product);
                if (product.stock >= item.quantity) {
                    // Calcular subtotal del producto
                    const subtotal = product.price * item.quantity;
                    totalAmount += subtotal;

                    // Reducir stock
                    product.stock -= item.quantity;
                    await ProductRepository.updateProduct(product._id, product);

                    // Añadir los detalles del producto procesado
                    productDetails.push({
                        title: product.title,   // Añadir el nombre del producto
                        price: product.price,   // Precio del producto
                        quantity: item.quantity, // Cantidad comprada
                        subtotal: subtotal      // Subtotal calculado
                    });
                } else {
                    // Si no hay suficiente stock, añadir a productos no procesados
                    unprocessedProducts.push({ productId: item.product, title: product.title });
                }
            }

            const ticket = {
                code: `TICKET-${Date.now()}`,
                amount: totalAmount,
                purchaser: userEmail,
                productDetails: productDetails  // Incluir los detalles del producto en el ticket
            };

            // Enviar el correo de confirmación de la compra
            await EmailService.sendPurchaseConfirmation(userEmail, ticket, totalAmount);

            return { ticket, unprocessedProducts };
        } catch (error) {
            throw new Error('Error processing purchase: ' + error.message);
        }
    }

    async updateProductQuantity(cid, productId, quantity) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                throw new Error('Cart not found');
            }

            // Find the product in the cart
            const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId.toString());
            if (productIndex === -1) {
                throw new Error('Product not found in cart');
            }

            // Update the quantity
            cart.products[productIndex].quantity = quantity;

            // Save the updated cart
            await CartRepository.updateCart(cart._id, cart);

            return cart;
        } catch (error) {
            throw new Error('Error updating product quantity: ' + error.message);
        }
    }
}

export default new CartService();
