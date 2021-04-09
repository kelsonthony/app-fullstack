//generate token using seret from process,ebv
const jwt = require('jsonwebtoken')

//generate token and return it
function generateToken(user) {

    if(!user) return null

    const userPersonal = {
        userId: user.userId,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin
    }

    return jwt.sign(userPersonal, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    })
}

//return basic user details
function getCleanUser(user) {
    if(!user) return null

    return {
        userId: user.userId,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin
    }
}

module.exports = {
    generateToken,
    getCleanUser
}