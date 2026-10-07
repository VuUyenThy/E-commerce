const prisma = require('../prisma/client');

exports.getCurrentUser = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { uid: Number(req.user.uid) },
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

exports.getUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true,
            },
        });

        return res.status(200).json(users);
    } catch (error) {
        return next(error);
    }
};
