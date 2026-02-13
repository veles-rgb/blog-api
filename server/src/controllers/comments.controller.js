const { validate: isUuid } = require("uuid");

async function getPostCommentsById(req, res, next) {
    // /api/comments?postId=...
    try {
        const { postId } = req.query;

        if (!postId) return res.status(400).json({ message: "postId is required" });
        if (!isUuid(postId)) return res.status(404).json({ message: "Post not found" });

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({ where: { id: postId } });
        if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });

        const comments = await prisma.comments.findMany({
            where: { postId: postId },
            include: {
                user: { select: { username: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ comments });

    } catch (error) {
        return next(error);
    }
}

async function getCommentById(req, res, next) {
    try {
        const { commentId } = req.params;

        if (!isUuid(commentId)) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const comment = await prisma.comments.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        return res.status(200).json({ comment });
    } catch (error) {
        return next(error);
    }
}

async function postComment(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;
        const { content } = req.body || {};

        if (!postId) return res.status(400).json({ message: "postId is required" });
        if (!content || !content.trim()) return res.status(400).json({ message: "content is required" });
        if (content.trim().length > 1000) return res.status(400).json({ message: 'Comment must not exceed 1000 characters' });

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comment = await prisma.comments.create({
            data: {
                content: content.trim(),
                postId,
                userId: user.id,
            },
            include: {
                user: { select: { username: true } },
            },
        });

        return res.status(201).json({ comment });
    } catch (error) {
        return next(error);
    }
}


async function getAllUserComments(req, res, next) {
    try {
        const user = req.user;
        const { username } = req.params;

        const { prisma } = await import("../lib/prisma.mjs");

        const commentUser = await prisma.users.findUnique({
            where: { username },
        });

        if (!commentUser) return res.status(404).json({ message: "Username not found" });
        if (!user.isAdmin && user.id !== commentUser.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const comments = await prisma.comments.findMany({
            where: { userId: commentUser.id },
            include: {
                post: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ comments });
    } catch (error) {
        return next(error);
    }
}

async function deleteCommentById(req, res, next) {
    try {
        const user = req.user;
        const { commentId } = req.params;

        if (!isUuid(commentId)) {
            return res.status(404).json({ message: "Comment not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const comment = await prisma.comments.findUnique({
            where: { id: commentId },
        });

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (!user.isAdmin && comment.userId !== user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const deletedComment = await prisma.comments.delete({
            where: { id: commentId },
        });

        return res.status(200).json({ deletedComment });
    } catch (error) {
        return next(error);
    }
}

async function getMyPostComments(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;

        if (!postId) return res.status(400).json({ message: "postId is required" });
        if (!isUuid(postId)) return res.status(404).json({ message: "Post not found" });

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({ where: { id: postId, authorId: user.id } });
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comments = await prisma.comments.findMany({
            where: { postId: postId },
            include: {
                user: { select: { username: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ comments, post: post.title });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    getPostCommentsById,
    getCommentById,
    postComment,
    getAllUserComments,
    deleteCommentById,
    getMyPostComments
};