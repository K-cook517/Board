const passport = require('passport')
const local = require('./localStrategy')
const Member = require('../models/member')

//passport에 로그인 인증과정, 직렬화, 역직렬화를 등록

module.exports = () => {
   //직렬화(serializeMember): 로그인 성공 후 사용자 정보를 세션에 저장
   passport.serializeUser((member, done) => {
      console.log('member: ', member) //사용자 정보가 저장되어있는 객체
      done(null, member.id) //member테이블의 id값(pk)를 세션에 저장(세션 용량 절약을 위해 id만 저장)
   })
   //역직렬화(deserializeMember): 클라이언트에게 request가 올 때마다 세션에 저장된 사용자 id를 바탕으로 사용자 정보 조회
   passport.deserializeUser((id, done) => {
      //id는 직렬화에서 저장한 member.id
      //response 하려는 사용자 정보 취득
      //select id, nick, email, createdAt, updatedAt from members where id = ? limit 1
      Member.findOne({
         where: { id },
         attributes: ['id', 'nick', 'email', 'createdAt', 'updatedAt'],
      })
         .then((member) => done(null, member)) //성공 시 가져온 사용자 객체 정보를 반환
         .catch((err) => done(err))
   })
   local() //localStrategy.js에서 export된 함수(인증함수)를 passport에 추가
}
