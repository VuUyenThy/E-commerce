const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const env = require('../config/env');

const generateToken = (user) =>
    jwt.sign(
        {
            uid: user.uid,
            username: user.username,
            roleid: user.roleid,
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );

exports.register = async (req, res, next) => {
    try {
        const { username, fullname, password, roleid, mid } = req.body;

        if (!username || !fullname || !password || !roleid || !mid) {
            return res.status(400).json({
                message: 'username, fullname, password, roleid and mid are required',
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                fullname,
                password: hashedPassword,
                roleid: Number(roleid),
                mid: Number(mid),
            },
            select: {
                uid: true,
                username: true,
                fullname: true,
                roleid: true,
                mid: true,
            },
        });

        return res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } catch (error) {
        return next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);
        const { password: _, ...safeUser } = user;

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: safeUser,
        });
    } catch (error) {
        return next(error);
    }
};
