import Cart from '../models/cart.js';

class CartDAO {
    async findById(id) {
        return Cart.findById(id).populate('products.product');
    }

    async findAll() {
        return Cart.find().populate('products.product');
    }

    async create(cartData) {
        const cart = new Cart(cartData);
        return cart.save();
    }

    async update(id, cartData) {
        return Cart.findByIdAndUpdate(id, cartData, { new: true });
    }

    async delete(id) {
        return Cart.findByIdAndDelete(id);
    }
}

export default new CartDAO();
