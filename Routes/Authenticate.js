const express = require('express')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const ROUTE = express.Router()
const User = require('../Models/user')
const { findAccount, authenticated } = require('../Middlewares/account')
const { UserResource } = require('../Responses/User')
require('dotenv').config()

// REGISTER USER
ROUTE.post('', findAccount, async (req, res) => {
    const { username, password: pw, email, confirm: cpw } = req.body
    const { account: uaccount } = res
    if (Boolean(uaccount)) return res.send("Login - Account with deatils exists!")
    if (!Boolean(pw)) return res.status(400).send("Login - Password field is required")
    if (!Boolean(pw === cpw)) return res.status(400).send("Login - Password and confirm password must match!")
    if (!Boolean(email)) return res.send("Login - Please enter your email address!")
    if (!Boolean(username)) return res.status(400).send("Login - Please Chose a username!")

    const password = await bcrypt.hash(pw, 10)
    const acc = new User({ username, password, email })
    const [user] = await Promise.allSettled([acc.save()])

    if (user?.status === 'rejected') {
        return res.status(500).send("Login - Something went wrong!")
    }

    const accessToken = JWT.sign({
        userId: user._id,
        username: user.username,
        email: user.email
    }, process.env.JWT_SECRET)
    res.json({ accessToken, message: 'Login - Authenticaton successful!!', authenticated: true })
})

// LOGIN USER
ROUTE.post('/login', findAccount, async (req, res) => {
    const { password } = req.body
    const { account: uaccount } = res

    if (!Boolean(password)) {
        return res.status(401).send("Login - Password is required!")
    }
    try {
        if (!Boolean(uaccount)) return res.status(404).send('Login - User not found!')
        const phraseVerified = await bcrypt.compare(password, uaccount.password)
        if (phraseVerified !== true) return res.status(400).send("Login - Please check your credentials")
        const accessToken = JWT.sign({
            userId: uaccount._id,
            username: uaccount.username,
            email: uaccount.email
        }, process.env.JWT_SECRET)
        res.json({ accessToken, message: 'Login - Authenticaton successful!!', authenticated: true })
    } catch (error) {
        return res.status(500).send("Login - Something went wrong!")
    }
})


// GET USER
ROUTE.get('', authenticated, async (req, res) => {
    const { userId } = res.account
    const [profile] = await Promise.allSettled([User.findOne({ _id: userId })])
    if (profile.status === 'rejected') return res.status(500).send({ success: false, message: "Profile - Something went wrong!😢" })
    if (!Boolean(profile?.value)) return res.status(404).send("Profile - User not found!😢")
    const user_profile = UserResource(profile?.value)
    res.json({ profile: user_profile, success: true })
})


module.exports = ROUTE