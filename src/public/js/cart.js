document.addEventListener('DOMContentLoaded', () => {
    // Función para manejar la adición de un producto al carrito
    const addProductToCart = async (cartId, productId) => {
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error adding product to cart');
            }

            window.location.reload(); // Recargar la página después de añadir el producto
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    // Función para manejar la eliminación de un producto del carrito
    const removeProductFromCart = async (cartId, productId) => {
        try {
            const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error removing product from cart');
            }

            window.location.reload(); // Recargar la página después de eliminar el producto
        } catch (error) {
            console.error('Error removing product from cart:', error);
        }
    };

    // Añadir evento para añadir productos
    document.querySelectorAll('#add-product').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar el comportamiento predeterminado del botón
            const cartId = event.target.getAttribute('data-cart-id');
            const productId = event.target.getAttribute('data-product-id');
            addProductToCart(cartId, productId);
        });
    });

    // Añadir evento para eliminar productos
    document.querySelectorAll('#delete-product').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault(); // Evitar el comportamiento predeterminado del botón
            const cartId = event.target.getAttribute('data-cart-id');
            const productId = event.target.getAttribute('data-product-id');
            removeProductFromCart(cartId, productId);
        });
    });
});
