const prisma = require('../prisma/client');

exports.getProducts = async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    } catch (error) {
        return next(error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { pid: Number(id) },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        return next(error);
    }
};

exports.createProduct = async (req, res, next) => {
    try {
        const { pname, price, quantity } = req.body;

        if (!pname || !price || quantity === undefined) {
            return res.status(400).json({
                message: 'pname, price and quantity are required',
            });
        }

        const newProduct = await prisma.product.create({
            data: {
                pname,
                price: Number(price),
                quantity: Number(quantity),
            },
        });

        return res.status(201).json({
            message: 'Product created successfully',
            product: newProduct,
        });
    } catch (error) {
        return next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { pname, price, quantity } = req.body;

        const existingProduct = await prisma.product.findUnique({
            where: { pid: Number(id) },
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await prisma.product.update({
            where: { pid: Number(id) },
            data: {
                ...(pname && { pname }),
                ...(price !== undefined && { price: Number(price) }),
                ...(quantity !== undefined && { quantity: Number(quantity) }),
            },
        });

        return res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct,
        });
    } catch (error) {
        return next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const existingProduct = await prisma.product.findUnique({
            where: { pid: Number(id) },
        });

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await prisma.product.delete({
            where: { pid: Number(id) },
        });

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        return next(error);
    }
};
