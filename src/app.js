const express = require('express');
const cors = require('cors');
const prisma = require('./prisma/client');
const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Ecommerce API is running',
        environment: env.NODE_ENV,
    });
});

app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return res.status(200).json({
            status: 'ok',
            service: 'ecommerce-api',
            database: 'connected',
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            service: 'ecommerce-api',
            database: 'disconnected',
            message: error.message,
        });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
