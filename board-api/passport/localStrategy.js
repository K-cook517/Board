const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const Member = require('../models/member')

//로그인 시 사용자 정보를 DB에서 조회, 사용자 존재 여부와 비밀번호 비교
module.exports = () => {
   passport.use(
      new LocalStrategy(
         {
            usernameField: 'email',
            passwordField: 'password',
         },
         //실제 로그인 인증 로직
         async (email, password, done) => {
            //email: 사용자가 입력한 email값
            //password: 사용자가 입력한 password값
            try {
               //1. 이메일로 사용자 조회
               //select * from Members where email = ? ilmit 1
               const exMember = await Member.findOne({ where: { email } })

               //2. 이메일 해당하는 사용자가 있으면 비밀번호가 맞는지 확인
               if (exMember) {
                  //사용자가 입력한 비번과 DB에서 가져온 비번 비교
                  const result = await bcrypt.compare(password, exMember.password)

                  if (result) {
                     //비밀번호가 일치하면 사용자 객체를 passport에 반환
                     done(null, exMember)
                  } else {
                     //비밀번호가 일치하지 않는 경우 message 출력
                     done(null, false, { message: '비밀번호가 일치하지 않습니다.' })
                  }
               } else {
                  //3.이메일에 해당하는 사용자가 없는 경우 message를 passport에 반환
                  done(null, false, { message: '가입되지 않은 멤버입니다.' })
               }
            } catch (error) {
               console.log(error)
               done(error) //passport에 에러 객체 전달 > 이후 passport에서 에러 미들웨어로 전달
            }
         }
      )
   )
}
