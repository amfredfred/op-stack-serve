const User = require('../Models/user')
const JWT = require('jsonwebtoken')
require('dotenv').config()

async function findAccount(req, res, next) {
    const query_params = {}
    const account = req?.body?.email || req?.body?.username
    if (!Boolean(account)) return res.status(406).send('Auth - Email or Username is required! 🙏')
    if (account.split('@')[1])
        query_params.email = account
    if (account && !account.split('@')[1])
        query_params.username = account
    if (Boolean(req?.body?.email))
        if (!Boolean(req?.body?.email?.split('@')[1]))
            return res.status(406).send('Auth - Invaid email address provided! 😂')

    const [user] = await Promise.allSettled([User.findOne(query_params)])

    if (user?.status === 'rejected') {
        res.status(500).send('FindUser - Something went wrong!')
    }

    res['account'] = user.value

    next()
}

async function authenticated(req, res, next) {
    const { authorization } = req.headers
    const accessToken = String(authorization).split(' ')[1]
    if (!Boolean(accessToken)) return res.status(401).send("Auth - Authentication required 🙏!")
    JWT.verify(accessToken, process.env.JWT_SECRET, (err, account) => {
        if (Boolean(err)) return res.status(401).json({ message: "Auth - Try logging in again!", authenticated: false })
        res['account'] = account
        next()
    })
}

module.exports.findAccount = findAccount
module.exports.authenticated = authenticated