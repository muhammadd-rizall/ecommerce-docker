let express = require('express');
let app = express();

//dummy data
let products = [
    {id: 1, name: 'Product A', price: 100, Description: 'This is Product A'},
    {id: 2, name: 'Product B', price: 150, Description: 'This is Product B'},
    {id: 3, name: 'Product C', price: 200, Description: 'This is Product C'},
];

//endpoint to get all products
app.get('/products', (req, res) => {
    res.json(products);
});

//endpoint to get a product by id
app.get('/products/:id', (req, res) => {
    let productId = parseInt(req.params.id);
    let product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

//start the server
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Product service is running on port ${PORT}`);
});


// //cara kedua
// app.listen(3000, () => {
//     console.log('Product service is running on port 3000');
// });