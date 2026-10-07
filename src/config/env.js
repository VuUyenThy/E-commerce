require('dotenv').config();

const env = {
    PORT: Number(process.env.PORT) || 3001,
    DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgresql://postgres:123456@localhost:5432/ecommerce_db?schema=public',
    JWT_SECRET: process.env.JWT_SECRET || 'development_secret_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = env;
