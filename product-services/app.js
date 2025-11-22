const express = require('express');
const axios = require('axios');
const app = express();

// Middleware untuk parse JSON
app.use(express.json());

// Dummy data produk
const products = [
    { id: 1, name: 'iPhone 17 Pro Max', price: 100, Description: 'This is iPhone 17 Pro Max' },
    { id: 2, name: 'Microwave', price: 150, Description: 'This is Microwave' },
    { id: 3, name: 'Laptop Macbook', price: 200, Description: 'This is Laptop Macbook' },
];

// Endpoint untuk mendapatkan daftar produk
app.get('/products', (req, res) => {
    res.json(products);
});

// Endpoint untuk mendapatkan detail produk berdasarkan ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

// Tambah produk ke cart
app.post('/products/:id/add-to-cart', async (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const response = await axios.post('http://cart-service:8000/carts', {
            product_id: product.id,
            quantity: 1
        });

        res.json({
            message: 'Product added to cart',
            cart: response.data
        });

    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).json({ 
            message: 'Failed to add to cart', 
            error: error.message 
        });
    }
});

// Menjalankan server pada port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Product service is running on port ${PORT}`);
});