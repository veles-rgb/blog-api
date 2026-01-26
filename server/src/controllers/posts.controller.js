async function getAllPosts(req, res, next) {

}

async function getPostById(req, res, next) {

}

async function getPostBySlug(req, res, next) {

}

async function createPost(req, res, next) {
    // Must be user or admin check
    // Get current user ID
    // Create post in DB with user ID
}

async function updatePostById(req, res, next) {
    // Must be user or admin check
    // Get current user ID
    // Update post in DB
}

async function deletePostById(req, res, next) {
    // Must be user or admin check
    // Get current user ID
    // Delete post in DB
}

async function updatePostPublished(req, res, next) {
    // Must be user or admin check
    // Check if already published
    // Set publishedAt 
}

async function updatePostUnpublish(req, res, next) {
    // Must be user or admin check
    // Check if published
    // Clear publishedAt
}

module.exports = {
    getAllPosts,
    getPostById,
    getPostBySlug,
    createPost,
    updatePostById,
    deletePostById,
    updatePostPublished,
    updatePostUnpublish,
};