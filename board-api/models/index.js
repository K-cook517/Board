const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const Member = require('./member')
const Post = require('./post')
const Hashtag = require('./hashtag')

const db = {}
const sequelize = new Sequelize(config.database, config.username, config.password, config)

db.sequelize = sequelize
db.Member = Member
db.Post = Post
db.Hashtag = Hashtag

Member.init(sequelize)
Post.init(sequelize)
Hashtag.init(sequelize)

Member.associate(db)
Post.associate(db)
Hashtag.associate(db)

module.exports = db
