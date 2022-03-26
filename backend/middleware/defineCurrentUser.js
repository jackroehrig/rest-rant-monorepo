const db = require('../models')
const jwt = require('json-web-token')
require('dotenv').config()

const {User} = db

async function defineCurrentUser(req, res, next){
    try {
        const [authenticationMethod, token] = req.headers.authorization.split(' ')
        if(authenticationMethod == 'Bearer'){
            const result = await jwt.decode(process.env.JWT_SECRET, token)
            const {id} = result.value
            let user = await User.findOne({
                where: {userId: id}
            })
            req.currentUser = user
        }
        next()
    } catch{
        req.currentUser = null
        next()
    }
}

module.exports = defineCurrentUser