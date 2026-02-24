const express = require('express');
const app = express();
const port = 3000;

let products = [
    { id: 1, name: 'Ноутбук ASUS', price: 65990 },
    { id: 2, name: 'Смартфон Samsung Galaxy', price: 45990 },
    { id: 3, name: 'Наушники Sony WH-1000XM5', price: 24990 }
];

app.use(express.json());

app.use(function(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

app.get('/', function(req, res) {
    res.send(`
        <h1>API управления товарами</h1>
        <p>Доступные маршруты:</p>
        <ul>
            <li>GET /products - получить все товары</li>
            <li>GET /products/:id - получить товар по ID</li>
            <li>POST /products - создать новый товар</li>
            <li>PATCH /products/:id - обновить товар</li>
            <li>DELETE /products/:id - удалить товар</li>
        </ul>
    `);
});
app.post('/products', function(req, res) {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ 
            error: 'Необходимо указать название и стоимость' 
        });
    }

    if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ 
            error: 'Стоимость должна быть положительным числом' 
        });
    }

    const newProduct = {
        id: Date.now(),
        name: name.trim(),
        price: Number(price)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get('/products', function(req, res) {
    res.json(products);
});

app.get('/products/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const product = products.find(function(p) {
        return p.id === id;
    });

    if (!product) {
        return res.status(404).json({ 
            error: 'Товар не найден' 
        });
    }

    res.json(product);
});
app.patch('/products/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const product = products.find(function(p) {
        return p.id === id;
    });

    if (!product) {
        return res.status(404).json({ 
            error: 'Товар не найден' 
        });
    }

    const { name, price } = req.body;

    if (name === undefined && price === undefined) {
        return res.status(400).json({ 
            error: 'Укажите хотя бы одно поле' 
        });
    }

    if (name !== undefined) {
        product.name = name.trim();
    }
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ 
                error: 'Стоимость должна быть положительным числом' 
            });
        }
        product.price = Number(price);
    }

    res.json(product);
});

app.delete('/products/:id', function(req, res) {
    const id = parseInt(req.params.id);
    const index = products.findIndex(function(p) {
        return p.id === id;
    });

    if (index === -1) {
        return res.status(404).json({ 
            error: 'Товар не найден' 
        });
    }

    products.splice(index, 1);
    res.status(204).send();
});
app.use(function(req, res) {
    res.status(404).json({ 
        error: 'Маршрут не найден' 
    });
});

app.use(function(err, req, res, next) {
    console.error('Ошибка:', err);
    res.status(500).json({ 
        error: 'Внутренняя ошибка сервера' 
    });
});

app.listen(port, function() {
    console.log(`Сервер запущен на http://localhost:${port}`);
});