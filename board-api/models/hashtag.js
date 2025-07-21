const Sequelize = require('sequelize')

module.exports = class Hashtag extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            //#해시태그 #코드 #작성
            title: {
               type: Sequelize.STRING(15),
               allowNull: false,
               unique: true,
            },
         },
         {
            sequelize,
            timestamps: true, //createAt, updateAt ..등 자동 생성
            underscored: false,
            modelName: 'Hashtag',
            tableName: 'hashtags',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }
   static associate(db) {
      db.Hashtag.belongsToMany(db.Board, {
         through: 'BoardHashtag',
         foreignKey: 'hashtag_id', //교차테이블에서 Hashtag 모델의 FK
         otherKey: 'board_id', //Board 모델의 FK
      })
   }
}
