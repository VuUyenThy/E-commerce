const prisma = require('../prisma/client');

exports.createOrder = async (req, res, next) => {
    try {
        const { uid, items } = req.body;

        if (!uid || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'uid and items are required',
            });
        }

        const userExists = await prisma.user.findUnique({
            where: { uid: Number(uid) },
        });

        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: { uid: Number(uid) },
            });

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { pid: Number(item.pid) },
                });

                if (!product) {
                    throw new Error(`Product with id ${item.pid} not found`);
                }

                const qty = Number(item.qty);

                if (qty <= 0) {
                    throw new Error(`Qty for product ${item.pid} must be greater than 0`);
                }

                if (product.quantity < qty) {
                    throw new Error(`Not enough stock for product ${item.pid}`);
                }

                await tx.orderDetail.create({
                    data: {
                        oid: newOrder.oid,
                        pid: Number(item.pid),
                        qty,
                        unit_price: product.price,
                    },
                });

                await tx.product.update({
                    where: { pid: Number(item.pid) },
                    data: {
                        quantity: product.quantity - qty,
                    },
                });
            }

            return newOrder;
        });

        return res.status(201).json({
            message: 'Order created successfully',
            order,
        });
    } catch (error) {
        return next(error);
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        uid: true,
                        username: true,
                        fullname: true,
                    },
                },
                shipment: true,
                details: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return res.status(200).json(orders);
    } catch (error) {
        return next(error);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { oid: Number(id) },
            include: {
                user: {
                    select: {
                        uid: true,
                        username: true,
                        fullname: true,
                    },
                },
                shipment: true,
                details: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return next(error);
    }
};
