async function getUserById(req, res, next) {

}

async function deleteUserById(req, res, next) {
    // Must be user or admin check
    // Delete user from DB
}

async function getAllUsers(req, res, next) {
    // Must be admin check
    // Get all posts from DB
}

async function updateAdminStatus(req, res, next) {
    // Must be admin check
    // Check if user already admin
    // set isAdmin true or false
}

async function updateAuthorStatus(req, res, next) {
    // Must be admin check
    // Check if user already author
    // Set isAuthor true or false
}

module.exports = {
    getUserById,
    deleteUserById,
    getAllUsers,
    updateAdminStatus,
    updateAuthorStatus,
};