import Product from '../models/product.js';

class ProductDAO {
    async findById(id) {
        return Product.findById(id);
    }

    async findAll(query, options) {
        return Product.paginate(query, options);
    }

    async create(productData) {
        const product = new Product(productData);
        return product.save();
    }

    async update(id, productData) {
        return Product.findByIdAndUpdate(id, productData, { new: true, runValidators: true });
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

export default new ProductDAO();
