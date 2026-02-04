const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
    try {
        const { prisma } = await import("../lib/prisma.mjs");
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await prisma.users.create({
            data: {
                username: req.body.username,
                hashedPassword,
                email: req.body.email,
                isAuthor: false,
                isAdmin: false,
            },
            select: { id: true, username: true, email: true, isAuthor: true, isAdmin: true, createdAt: true }
        });

        return res.status(201).json(user);
    } catch (error) {
        return next(error);
    }
}

async function login(req, res, next) {
    try {
        const user = req.user;
        // Sign token
        const token = jwt.sign(
            { sub: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAuthor: user.isAuthor,
                isAdmin: user.isAdmin,
            },
        });
    } catch (error) {
        return next(error);
    }
}

async function logout(req, res, next) {
    // Token removed in front-end
    return res.status(200).json({ message: "Logged out" });
}

function verify(req, res) {
    const user = req.user;

    const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        isAuthor: user.isAuthor,
        createdAt: user.createdAt,
    };

    return res.status(200).json({ user: safeUser });
}

module.exports = {
    register,
    login,
    logout,
    verify
};