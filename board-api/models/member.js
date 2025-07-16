const Sequelize = require('sequelize')

module.exports = class Member extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            email: {
               type: Sequelize.STRING(30),
               allowNull: false,
               unique: true,
            },
            nick: {
               type: Sequelize.STRING(20),
               allowNull: false,
            },
            password: {
               type: Sequelize.STRING(100),
               allowNull: false,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Member',
            tableName: 'members',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }
   static associate(db) {
      db.Member.hasMany(db.Post, {
         foreignKey: 'member_id',
         sourceKey: 'id',
      })
   }
}
