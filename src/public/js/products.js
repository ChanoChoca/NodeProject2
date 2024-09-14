document.addEventListener('DOMContentLoaded', () => {

    // Obtiene todos los botones con la clase 'add-to-cart'
    const addToCartBtns = document.querySelectorAll('.add-to-cart');

    // Recorre todos los botones y les añade el event listener
    addToCartBtns.forEach(button => {
        // Obtiene los atributos 'data-id' y 'data-cart-id' del botón
        const productId = button.getAttribute('data-id');
        const cartId = button.getAttribute('data-cart-id');

        // Añade el event listener al botón
        button.addEventListener('click', () => {
            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products: [{ product: productId, quantity: 1 }] }),
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
});
