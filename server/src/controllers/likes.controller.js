const { validate: isUuid } = require("uuid");

async function getPostLikesById(req, res, next) {
    // /api/comments?postId=...

    try {
        const { postId } = req.query;
        if (!postId) return res.status(400).json({ message: "postId is required" });
        if (!isUuid(postId)) return res.status(404).json({ message: "Post not found" });

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId }
        });

        if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });

        const likesCount = await prisma.post_Likes.count({
            where: { postId }
        });

        return res.status(200).json({
            postId,
            likes: likesCount
        });
    } catch (error) {
        return next(error);
    }
}

async function postLike(req, res, next) {
    try {
        const { postId } = req.params;
        if (!postId) return res.status(400).json({ message: "postId is required" });
        if (!isUuid(postId)) return res.status(404).json({ message: "Post not found" });

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId }
        });

        if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });

        // Check if already liked post
        const likedPost = await prisma.post_Likes.findUnique({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId,
                },
            },
        });

        if (!likedPost) {
            const liked = await prisma.post_Likes.create({
                data: {
                    postId,
                    userId: req.user.id
                }
            });

            return res.status(201).json({ liked });
        } else {
            return res.status(409).json({ message: "Post already liked." });
        }

    } catch (error) {
        return next(error);
    }
}

async function deleteLike(req, res, next) {
    try {
        const { postId } = req.params;
        if (!isUuid(postId)) return res.status(404).json({ message: "Post not found" });

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({ where: { id: postId } });
        if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });

        const likedPost = await prisma.post_Likes.findUnique({
            where: {
                userId_postId: { userId: req.user.id, postId },
            },
        });

        if (!likedPost) {
            return res.status(204).send(); // already unliked
        }

        await prisma.post_Likes.delete({
            where: {
                userId_postId: { userId: req.user.id, postId },
            },
        });

        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
}

async function getAllUserLikes(req, res, next) {
    try {
        const user = req.user;
        const { username } = req.params;

        const { prisma } = await import("../lib/prisma.mjs");

        const likeUser = await prisma.users.findUnique({
            where: {
                username,
            },
        });

        if (!likeUser) return res.status(404).json({ message: "Username not found" });
        if (!user.isAdmin && user.id !== likeUser.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const likes = await prisma.post_Likes.findMany({
            where: { userId: likeUser.id },
            include: {
                post: { select: { id: true, slug: true, title: true } }
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ likes });
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    getPostLikesById,
    postLike,
    getAllUserLikes,
    deleteLike,
};