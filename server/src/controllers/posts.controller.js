const slugify = require("slugify");
const { validate: isUuid } = require("uuid");
const sanitizeContent = require("../lib/sanitizeHtml");

async function getAllPosts(req, res, next) {
    try {
        const { prisma } = await import("../lib/prisma.mjs");

        const posts = await prisma.posts.findMany({
            where: { isPublished: true },
            include: {
                author: { select: { username: true } },
                _count: {
                    select: { postLikes: true, comments: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ posts });
    } catch (error) {
        return next(error);
    }
}

async function getAllUserPosts(req, res, next) {
    try {
        const { username } = req.params;
        const { prisma } = await import("../lib/prisma.mjs");

        const posts = await prisma.posts.findMany({
            where: {
                isPublished: true,
                author: { username },
            },
            include: {
                author: { select: { username: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ posts });
    } catch (error) {
        return next(error);
    }
}

async function getPostById(req, res, next) {
    try {
        const { postId } = req.params;

        if (!isUuid(postId)) {
            return res.status(404).json({ message: "Post not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId },
        });

        if (!post || !post.isPublished) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ post });
    } catch (error) {
        return next(error);
    }
}

async function getPostBySlug(req, res, next) {
    try {
        const { username, slug } = req.params;
        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findFirst({
            where: {
                slug,
                isPublished: true,
                author: { username },
            },
            include: {
                author: { select: { username: true } },
                _count: {
                    select: {
                        postLikes: true
                    }
                }
            },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ post });
    } catch (error) {
        return next(error);
    }
}

async function createPost(req, res, next) {
    try {
        const user = req.user;

        if (!user.isAuthor && !user.isAdmin) {
            return res.status(403).json({ message: "You are not an author or admin." });
        }

        const { title, content, isPublished } = req.body;
        if (title.trim().length < 2 || title.trim().length > 150) {
            return res.status(400).json({ message: 'Title must be between 2 & 150 characters' });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const safeContent = sanitizeContent(content || "");

        const post = await prisma.posts.create({
            data: {
                authorId: user.id,
                title,
                content: safeContent,
                isPublished: Boolean(isPublished),
                publishedAt: isPublished ? new Date() : null,
                slug: slugify(title, { lower: true, strict: true }),
            },
        });

        return res.status(201).json({ post });
    } catch (error) {
        return next(error);
    }
}


async function updatePostById(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;

        if (!isUuid(postId)) {
            return res.status(404).json({ message: "Post not found" });
        }

        let { title, content, isPublished } = req.body || {};
        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!user.isAdmin && post.authorId !== user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!title) title = post.title;
        if (content === undefined) {
            content = post.content;
        } else {
            content = sanitizeContent(content);
        }

        const data = { title, content, updatedAt: new Date(), isPublished, publishedAt: new Date() };

        if (title !== post.title) {
            data.slug = slugify(title, { lower: true, strict: true });
        }

        const updatedPost = await prisma.posts.update({
            where: { id: postId },
            data,
        });

        return res.status(200).json({ updatedPost });
    } catch (error) {
        return next(error);
    }
}

async function deletePostById(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;

        if (!isUuid(postId)) {
            return res.status(404).json({ message: "Post not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId },
        });

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!user.isAdmin && post.authorId !== user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const deletedPost = await prisma.posts.delete({
            where: { id: postId },
        });

        return res.status(200).json({ deletedPost });
    } catch (error) {
        return next(error);
    }
}

async function publishPost(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;

        if (!isUuid(postId)) {
            return res.status(404).json({ message: "Post not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId },
        });

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!user.isAdmin && post.authorId !== user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (post.isPublished) return res.status(200).json({ message: "Post is already published" });

        const publishedPost = await prisma.posts.update({
            where: { id: postId },
            data: {
                isPublished: true,
                publishedAt: new Date(),
            },
        });

        return res.status(200).json({ publishedPost });
    } catch (error) {
        return next(error);
    }
}

async function unpublishPost(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;

        if (!isUuid(postId)) {
            return res.status(404).json({ message: "Post not found" });
        }

        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: { id: postId },
        });

        if (!post) return res.status(404).json({ message: "Post not found" });

        if (!user.isAdmin && post.authorId !== user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!post.isPublished) return res.status(200).json({ message: "Post is already unpublished" });

        const unpublishedPost = await prisma.posts.update({
            where: { id: postId },
            data: {
                isPublished: false,
                publishedAt: null,
            },
        });

        return res.status(200).json({ unpublishedPost });
    } catch (error) {
        return next(error);
    }
}

async function getMyPosts(req, res, next) {
    try {
        const user = req.user;
        const { prisma } = await import("../lib/prisma.mjs");

        const posts = await prisma.posts.findMany({
            where: {
                authorId: user.id
            },
            include: {
                author: { select: { username: true } },
                _count: { select: { postLikes: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({ posts });
    } catch (error) {
        return next(error);
    }
}

async function getMyPostById(req, res, next) {
    try {
        const user = req.user;
        const { postId } = req.params;
        const { prisma } = await import("../lib/prisma.mjs");

        const post = await prisma.posts.findUnique({
            where: {
                authorId: user.id,
                id: postId,
            }
        });

        if (!post) return res.status(404).json({ message: "Post not found" });

        return res.status(200).json({ post });
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    getAllPosts,
    getAllUserPosts,
    getPostById,
    getPostBySlug,
    createPost,
    updatePostById,
    deletePostById,
    publishPost,
    unpublishPost,
    getMyPosts,
    getMyPostById
};