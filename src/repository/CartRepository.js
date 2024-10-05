import CartDAO from '../dao/CartDAO.js';

class CartRepository {
    async getCartById(id) {
        return CartDAO.findById(id);
    }

    async getAllCarts() {
        return CartDAO.findAll();
    }

    async createCart(cartData) {
        return CartDAO.create(cartData);
    }

    async updateCart(id, cartData) {
        return CartDAO.update(id, cartData);
    }

    async deleteCart(id) {
        return CartDAO.delete(id);
    }
}

export default new CartRepository();
