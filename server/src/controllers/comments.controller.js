async function getPostCommentsById(req, res, next) {
    // /api/comments?postId=...
    // Get post id
    // Get comments from post id
}

async function getCommentById(req, res, next) {
    // Get comment ID
    // Get comment
}

async function postComment(req, res, next) {
    // Check if logged in
    // Get current post ID
    // Create comment
}

async function getAllUserComments(req, res, next) {
    // Check if owner or admin
    // Get user ID
    // Get all user comments
}

async function updateCommentById(req, res, next) {
    // Check if owner or admin
    // Get comment ID
    // Update comment
}

async function deleteCommentById(req, res, next) {
    // Check if owner or admin
    // Get comment ID
    // Delete comment
}

module.exports = {
    getPostCommentsById,
    getCommentById,
    postComment,
    getAllUserComments,
    updateCommentById,
    deleteCommentById,
};