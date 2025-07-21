const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config')[env]

const Member = require('./member')
const Board = require('./board')
const Hashtag = require('./hashtag')

const db = {}
const sequelize = new Sequelize(config.database, config.Membername, config.password, config)

db.sequelize = sequelize
db.Member = Member
db.Board = Board
db.Hashtag = Hashtag

Member.init(sequelize)
Board.init(sequelize)
Hashtag.init(sequelize)

Member.associate(db)
Board.associate(db)
Hashtag.associate(db)

module.exports = db
