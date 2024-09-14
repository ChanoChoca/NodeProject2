document.addEventListener('DOMContentLoaded', () => {
    const addToCartBtn = document.getElementById('add-to-cart');
    if (!addToCartBtn) {
        console.error('Add to cart button not found in the DOM');
        return;
    }

    const cartId = addToCartBtn.getAttribute('data-cart-id');
    const productId = addToCartBtn.getAttribute('data-product-id');

    console.log('cartId:', cartId); // Verifica que cartId esté correctamente
    console.log('productId:', productId); // Verifica que productId esté correctamente

    addToCartBtn.addEventListener('click', () => {
        fetch(`/api/carts/${cartId}/products/${productId}`, { // Corrige la URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: [{ product: productId, quantity: 1 }] }), // Añade el cuerpo de la solicitud
        })
            .then(response => {
                return response.json().then(data => ({ status: response.status, body: data }));
            })
            .then(({ status, body }) => {
                if (status === 200) {
                    alert('Product added to cart!');
                } else {
                    alert(`Error adding product to cart: ${body.message}`);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
