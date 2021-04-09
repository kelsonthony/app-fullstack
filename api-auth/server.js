require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const utils = require('./utils')

const app = express()
const port = process.env.PORT || 4000;

//enable the cors
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: true } ))

//static user details
const userData = {
    userId: "123",
    password: "123456",
    name: "Kelson Anthony",
    username: "kanthony",
    isAdmin: true
}

//middlware
app.use(function (req, res, next) {
    let token = req.headers['authorization']
    if(!token) return next()

    token = token.replace('Bearer', '')
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
        if(err) {
            return res.status(401).json({
                error: true,
                message: 'Invalid User'
            })
        } else {
            req.user = user
            next()
        }
    })
})

//request handlers
app.get('/', (req, res) => {
    if(!req.user) return res.status(401).json({
        success: false,
        message: 'Invalid user to access'
    })
    res.send('Welcome to NodeJS API Full Stack - ', + req.user.name)
})

//validate users credentials
app.post('/users/signin', function (req, res) {
    const user = req.body.username
    const pwd = req.body.password

    if(!user || !pwd) {
        return res.status(400).json({
            error: true,
            message: 'Username or Password Invalid'
        })
    }

    if(user !== userData.username || pwd !== userData.password) {
        return res.status(401).json({
            error: true,
            message: 'Username or Password is Wrong'
        })
    }

    //generate token
    const token = utils.generateToken(userData)
    //get basic user details
    const userObj = utils.getCleanUser(userData)

    return res.json({ user: userObj, token })
})

//verify the token and turun it if it' valid
app.get('/verifyToken', function(req, res) {
    const token = req.query.token
    if(!token) {
        return res.status(400).json({
            error: true,
            message: 'Token is required'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {

        if(err) return res.status(401).json({
            error: true,
            message: 'Invalid Token'
        })

        if(user.userId !== userData.userId) {
            return res.status(401).json({
                error: true,
                message: 'Invalid User'
            })
        }

        const userObj = utils.getCleanUser(userData)
        return res.json({ user: userObj, token })
    })
})

app.listen(port, () => {
    console.log('Server Running on: ' + port)
})

