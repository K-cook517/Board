const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt') //암호화
const passport = require('passport')

const Member = require('../models/member')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')

//회원가입 (localhost:8000/auth/join)
router.post('/join', isNotLoggedIn, async (req, res, next) => {
   try {
      console.log(req.body)
      const { email, nick, password } = req.body
      const exMember = await Member.findOne({
         where: { email },
      })
      //같은 이메일이면 409 상태코드 찍고 메세지 전달
      if (exMember) {
         const error = new Error('이미 존재하는 사용자입니다.')
         error.status = 409 // Conflict
         return next(error) //에러 미들웨어 이동
      }

      //이메일 중복확인 통과시 새로운 멤버 계정 생성
      // ㄴ미리 만들기만 함 아직 없음

      //비번 암호화
      const hash = await bcrypt.hash(password, 12)

      //멤버 신규 생성
      const newMember = await Member.create({
         email,
         nick,
         password: hash,
      })

      //성공
      res.status(201).json({
         success: true,
         message: '멤버 등록을 성공적으로 마쳤습니다.',
         //insert 한 데이터 일부 전달
         member: {
            id: newMember.id,
            email: newMember.email,
            nick: newMember.nick,
         },
      })
   } catch (error) {
      // 에러발생시 미들웨어로 전달
      error.status = 500
      error.message = '회원가입 중 오류가 발생했습니다.'
      next(error)
   }
})

//로그인
router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, member, info) => {
      if (authError) {
         authError.status = 500
         authError.message = '인증 중 오류 발생'
         return next(authError)
      }
      if (!member) {
         //코드 401: 입력하다 인증 안 됐거나 뭔가 틀림
         const err = new Error(info.message || '로그인 실패')
         err.status = 401 // Unauthorized
         return next(err)
      }
      req.login(member, (loginError) => {
         if (loginError) {
            // 로그인 상태로 바꾸는 중 오류 발생시
            loginError.status = 500
            loginError.message = '로그인 중 오류 발생'
            return next(loginError)
         }

         //로그인 성공시 member객체와 함께 response
         res.status(200).json({
            success: true,
            message: '로그인 성공',
            member: {
               id: member.id,
               nick: member.nick,
            },
         })
      })
   })(req, res, next)
})

//로그아웃
router.get('/logout', isLoggedIn, async (req, res, next) => {
   req.logout((logoutError) => {
      if (logoutError) {
         logoutError.status = 500
         logoutError.message = '로그아웃 중 오류가 발생했습니다.'
         return next(logoutError)
      }
      res.status(200).json({
         success: true,
         message: '로그아웃에 성공했습니다.',
      })
   })
})

//현재 로그인 여부 확인
router.get('/status', async (req, res, next) => {
   try {
      if (req.isAuthenticated()) {
         //로그인 성공
         res.status(200).json({
            isAuthenticated: true,
            member: {
               id: req.user.id,
               nick: req.user.nick,
            },
         })
      } else {
         //로그인 실패
         res.status(200).json({
            isAuthenticated: false,
         })
      }
   } catch (error) {
      error.status = 500
      error.message = '로그인 확인 중 오류가 발생했습니다.'
      next(error)
   }
})

module.exports = router
