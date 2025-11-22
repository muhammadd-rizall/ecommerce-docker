<?php

use GuzzleHttp\Client;

$router->get('/cart', function () use ($router) {
    return 'Cart Service is running';
});

// Dummy cart data (kosong untuk start fresh)
$carts = [
    'items' => [
        [
            'id' => 100,
            'name' => 'Product A',
            'quantity' => 2,
            'price' => 50.00
        ],
        [
            'id' => 101,
            'name' => 'Product B',
            'quantity' => 1,
            'price' => 30.00
        ],
        [
            'id' => 102,
            'name' => 'Product C',
            'quantity' => 1,
            'price' => 50.00
        ]
    ],
    'total' => 180.00
];;

// Get all carts
$router->get('/carts', function () use ($carts) {
    return response()->json($carts);
});

// Get cart by id
$router->get('/carts/{id}', function ($id) use ($carts) {
    foreach ($carts['items'] as $item) {
        if ($item['id'] == $id) {
            return response()->json($item);
        }
    }
    return response()->json(['message' => 'Item not found'], 404);
});

// Delete item from cart
$router->delete('/carts/{id}', function ($id) use (&$carts) {
    $cartId = (int) $id;
    $exists = array_filter($carts['items'], fn($c) => $c['id'] === $cartId);

    if (!$exists) {
        return response()->json(['message' => 'Item not found'], 404);
    }

    // Simulate deletion by removing the item
    $carts['items'] = array_values(array_filter($carts['items'], fn($c) => $c['id'] !== $cartId));

    // Recalculate total
    $carts['total'] = array_reduce($carts['items'], function ($sum, $item) {
        return $sum + ($item['price'] * $item['quantity']);
    }, 0);

    return response()->json(['message' => 'Item deleted successfully', 'cart' => $carts]);
});

// Add item to cart
$router->post('/carts', function (\Illuminate\Http\Request $request) use (&$carts) {
    $productId = $request->input('product_id');
    $quantity = $request->input('quantity', 1); // Default to 1 if not provided

    if (!$productId) {
        return response()->json(['message' => 'product_id is required'], 400);
    }

    $client = new Client();
    try {

       
        // Fetch product details from product service
        $response = $client->get("http://product-service:3000/products/{$productId}");
        $product = json_decode($response->getBody()->getContents(), true);

        // Check if product already in cart, then update quantity
        $found = false;
        foreach ($carts['items'] as &$item) {
            if ($item['id'] == $productId) {
                $item['quantity'] += $quantity;
                $found = true;
                break;
            }
        }
        unset($item); // Break the reference

        // Add new item if not found
        if (!$found) {
            $carts['items'][] = [
                'id' => $product['id'],
                'name' => $product['name'],
                'quantity' => $quantity,
                'price' => $product['price']
            ];
        }

        // Recalculate total
        $carts['total'] = array_reduce($carts['items'], function ($sum, $item) {
            return $sum + ($item['price'] * $item['quantity']);
        }, 0);

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart' => $carts
        ]);
    } catch (\GuzzleHttp\Exception\ClientException $e) {
        if ($e->getResponse()->getStatusCode() == 404) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return response()->json([
            'message' => 'Error fetching product details: ' . $e->getMessage()
        ], 500);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An unexpected error occurred: ' . $e->getMessage()
        ], 500);
    }
});
