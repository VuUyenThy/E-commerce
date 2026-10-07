const prisma = require('../prisma/client');

exports.createShipment = async (req, res, next) => {
    try {
        const { oid, status } = req.body;

        if (!oid) {
            return res.status(400).json({ message: 'oid is required' });
        }

        const orderExists = await prisma.order.findUnique({
            where: { oid: Number(oid) },
        });

        if (!orderExists) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const shipment = await prisma.shipment.create({
            data: {
                oid: Number(oid),
                status: status || 'pending',
            },
        });

        return res.status(201).json({
            message: 'Shipment created successfully',
            shipment,
        });
    } catch (error) {
        return next(error);
    }
};

exports.getShipmentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const shipment = await prisma.shipment.findUnique({
            where: { shipid: Number(id) },
            include: {
                order: {
                    include: {
                        user: true,
                        details: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        return res.status(200).json(shipment);
    } catch (error) {
        return next(error);
    }
};

exports.updateShipmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'status is required' });
        }

        const shipment = await prisma.shipment.update({
            where: { shipid: Number(id) },
            data: { status },
        });

        return res.status(200).json({
            message: 'Shipment status updated successfully',
            shipment,
        });
    } catch (error) {
        return next(error);
    }
};
