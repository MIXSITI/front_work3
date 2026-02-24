const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => {
res.send('Кобылянский Сергей');
});
let products = [
    {id: 1, name: 'Ноутбук', price: 50000},
    {id: 2, name: 'Мышь', price: 1500},
    {id: 3, name: 'Клавиатура', price: 3000},
];

// Middleware для парсинга JSON
app.use(express.json());

// Главная страница
app.get('/', (req, res) => {
    res.send('API для управления товарами');
});

// CRUD операции
// 1. Получить все товары
app.get('/products', (req, res) => {
    res.json(products);
});

// 2. Получить товар по ID
app.get('/products/:id', (req, res) => {
    let product = products.find(p => p.id == req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({error: 'Товар не найден'});
    }
});

// 3. Создать новый товар
app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const newProduct = {
        id: Date.now(),
        name,
        price
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// 4. Обновить товар (PUT - полное обновление)
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
        return res.status(404).json({error: 'Товар не найден'});
    }
    const { name, price } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    res.json(product);
});

// 5. Частичное обновление товара (PATCH)
app.patch('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    if (!product) {
        return res.status(404).json({error: 'Товар не найден'});
    }
    const { name, price } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    res.json(product);
});

// 6. Удалить товар
app.delete('/products/:id', (req, res) => {
    const initialLength = products.length;
    products = products.filter(p => p.id != req.params.id);
    if (products.length < initialLength) {
        res.json({message: 'Товар удален'});
    } else {
        res.status(404).json({error: 'Товар не найден'});
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
