import ProductDAO from '../dao/ProductDAO.js';

class ProductRepository {
    async getProductById(id) {
        return ProductDAO.findById(id);
    }

    async getAllProducts(query, options) {
        return ProductDAO.findAll(query, options);
    }

    async createProduct(productData) {
        return ProductDAO.create(productData);
    }

    async updateProduct(id, productData) {
        return ProductDAO.update(id, productData);
    }

    async deleteProduct(id) {
        return ProductDAO.delete(id);
    }
}

export default new ProductRepository();
