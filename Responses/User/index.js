const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const UserResource = (user) => ({
    "username": user?.username,
    "email": user?.email,
    "earnings": user?.earnings,
    "createdAt": user?.createdAt ? { relative: dayjs(user?.createdAt).fromNow(), absolute: user?.createdAt } : '',
    "updatedAt": user?.createdAt ? { relative: dayjs(user?.updatedAt).fromNow(), absolute: user?.createdAt } : ''
})

const UserCollection = (users = []) => users.map(user => UserResource(user))
module.exports.UserResource = UserResource
module.exports.UserCollection = UserCollection




