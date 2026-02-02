const { validate: isUuid } = require("uuid");

async function getUserById(req, res, next) {
    try {
        const { userId } = req.params;

        if (!userId) return res.status(400).json({ message: "userId is required" });
        if (!isUuid(userId)) return res.status(404).json({ message: "User not found" });

        const { prisma } = await import("../lib/prisma.mjs");
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                isAuthor: true,
                isAdmin: true,
                createdAt: true
            },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user });
    } catch (error) {
        return next(error);
    }
}

async function getUserByUsername(req, res, next) {
    try {
        const { username } = req.params;

        const { prisma } = await import("../lib/prisma.mjs");
        const user = await prisma.users.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                isAuthor: true,
                isAdmin: true,
                createdAt: true
            },
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        return res.status(200).json({ user });
    } catch (error) {
        return next(error);
    }
}

async function deleteUserById(req, res, next) {
    try {
        const { userId } = req.params;

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!isUuid(userId)) {
            return res.status(404).json({ message: "User was not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true, isAuthor: true, isAdmin: true, createdAt: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User was not found" });
        }

        await prisma.users.delete({
            where: { id: userId },
        });

        return res.status(200).json({ message: "User deleted", user });
    } catch (error) {
        return next(error);
    }
}

async function getAllUsers(req, res, next) {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { prisma } = await import('../lib/prisma.mjs');

        const users = await prisma.users.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                isAuthor: true,
                isAdmin: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({ users });
    } catch (error) {
        return next(error);
    }
}

async function updateAdminStatus(req, res, next) {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { userId } = req.params;
        if (!isUuid(userId)) {
            return res.status(404).json({ message: "User was not found" });
        }

        if (req.user.id === userId) {
            return res.status(400).json({ message: "You cannot change your own admin status." });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User was not found" });

        const newStatus = !user.isAdmin;

        await prisma.users.update({
            where: { id: userId },
            data: { isAdmin: newStatus },
        });

        return res.status(200).json({
            message: newStatus
                ? `${user.username} has been made admin`
                : `${user.username} is no longer admin`,
        });
    } catch (error) {
        return next(error);
    }
}


async function updateAuthorStatus(req, res, next) {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { userId } = req.params;
        if (!isUuid(userId)) {
            return res.status(404).json({ message: "User was not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User was not found" });

        const newStatus = !user.isAuthor;

        await prisma.users.update({
            where: { id: userId },
            data: { isAuthor: newStatus },
        });

        return res.status(200).json({
            message: newStatus
                ? `${user.username} has been made author`
                : `${user.username} is no longer author`,
        });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getUserById,
    getUserByUsername,
    deleteUserById,
    getAllUsers,
    updateAdminStatus,
    updateAuthorStatus,
};