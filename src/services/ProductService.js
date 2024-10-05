import ProductRepository from '../repository/ProductRepository.js';

class ProductService {
    async getAllProducts(query, options) {
        try {
            return await ProductRepository.getAllProducts(query, options);
        } catch (error) {
            throw new Error(`Error getting products: ${error.message}`);
        }
    }

    async getProductById(productId) {
        try {
            const product = await ProductRepository.getProductById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        } catch (error) {
            throw new Error(`Error getting product: ${error.message}`);
        }
    }

    async createProduct(productData) {
        try {
            return await ProductRepository.createProduct(productData);
        } catch (error) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    async updateProduct(productId, productData) {
        try {
            return await ProductRepository.updateProduct(productId, productData);
        } catch (error) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async deleteProduct(productId) {
        try {
            await ProductRepository.deleteProduct(productId);
        } catch (error) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}

export default new ProductService();
