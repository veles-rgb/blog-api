async function getPostLikesById(req, res, next) {
    // /api/comments?postId=...
    // Get Post ID
    // Return likes
}

async function postLike(req, res, next) {
    // Check if user is logged in
    // Get post ID
    // Check if already liked
    // Add like
}

async function deleteLike(req, res, next) {
    // Check if user is logged in
    // Get post ID
    // Check if already liked
    // Remove like
}

module.exports = {
    getPostLikesById,
    postLike,
    deleteLike,
};