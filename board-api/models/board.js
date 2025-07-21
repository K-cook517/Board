const Sequelize = require('sequelize')

module.exports = class Board extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            //게시글 제목
            title: {
               type: Sequelize.TEXT,
               allowNull: false,
            },
            //글 내용
            content: {
               type: Sequelize.TEXT,
               allowNull: false,
            },
            //이미지 경로
            img: {
               type: Sequelize.STRING(200),
               allowNull: true,
            },
         },
         {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Board',
            tableName: 'boards',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
         }
      )
   }
   static associate(db) {
      db.Board.belongsTo(db.Member, {
         foreignKey: 'member_id',
         targetKey: 'id',
      })
      db.Board.belongsToMany(db.Hashtag, {
         through: 'BoardHashtag',
         foreignKey: 'board_id', //교차테이블에서 Board 모델의 FK
         otherKey: 'hashtag_id', //Hashtag 모델의 FK
      })
   }
}
