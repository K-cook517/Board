const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Board, Hashtag, Member } = require('../models')
const { isLoggedIn } = require('./middlewares')
const router = express.Router()

//uploads 폴더 없으면 만들기
try {
   fs.readdirSync('uploads')
} catch (error) {
   console.log('uploads 폴더가 없습니다. 새로 생성합니다.')
   fs.mkdirSync('uploads')
}

//이미지 업로드 multer
const upload = multer({
   storage: multer.diskStorage({
      destination(req, file, cb) {
         cb(null, 'uploads/')
      },
      filename(req, file, cb) {
         const decodeFileName = decodeURIComponent(file.originalname) //파일명 한국어 디코딩(깨짐 방지)
         const ext = path.extname(decodeFileName) //확장자 추출
         const basename = path.basename(decodeFileName, ext) //확장자 제거한 파일명 추출
         cb(null, basename + Date.now() + ext)
      },
   }),
   limits: { fileSize: 5 * 1024 * 1024 }, //파일 크기 5MB
})

//게시물 등록
router.post('/', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      console.log('파일정보:', req.file)
      console.log('formData:', req.body)
      //업로드 한 파일 없을 때
      if (!req.file) {
         const error = new Error('파일 업로드 실패')
         error.status = 400
         return next(error)
      }

      //게시물 등록
      //Board 테이블에 insert
      const board = await Board.create({
         title: req.body.title,
         content: req.body.content,
         img: `/${req.file.filename}`,
         member_id: req.user.id,
      })

      //해시태그 등록
      const hashtags = req.body.hashtags.match(/#[^\s#]*/g) //#을 기준으로 해시태그 추출
      //추출된 해시태그 있을 경우
      if (hashtags) {
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) }, //#을 제외한 문자만
               })
            )
         )
         await board.addHashtags(result.map((r) => r[0]))
      }
      res.status(200).json({
         success: true,
         board: {
            id: board.id,
            title: board.title,
            content: board.content,
            img: board.img,
            memberId: board.member_id,
         },
         message: '게시물 등록이 성공했습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 등록 중 오류 발생'
      next(error)
   }
})

//게시물 수정 (localhost:8000/board/:id)
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      //1.게시물 존재여부 확인
      //select * from boards where id = ? and user_id = ? limit 1
      const board = await Board.findOne({
         where: { id: req.params.id, member_id: req.user.id },
      })
      if (!board) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      //board 테이블 수정
      await board.update({
         title: req.body.title,
         content: req.body.content,
         img: req.file ? `/${req.file.filename}` : board.img, //수정된 이미지가 있으면 바꿈
      })

      const hashtags = req.body.hashtags.match(/#[^\s#]*/g) // #을 기준으로 해시태그 추출

      if (hashtags) {
         const result = await Promise.all(
            //hashtag 테이블 수정
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) }, //#을 제외한 문자만
               })
            )
         )
         await board.setHashtags(result.map((r) => r[0]))
      }

      //수정 게시물 재조회(선택사항)
      const updatedBoard = await Board.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: Member,
               attributes: ['id', 'nick'], //Member테이블의 id, nick 컬럼 값 가져옴
            },
            {
               model: Hashtag,
               attributes: ['title'], //hashtags테이블의 title 컬럼 값 가져옴
            },
         ],
      })
      res.status(200).json({
         success: true,
         board: updatedBoard,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 수정 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시물 삭제 (localhost:8000/board/:id)
router.delete('/:id', isLoggedIn, async (req, res, next) => {
   try {
      //1. 삭제할 게시물 존재 여부 확인
      const board = await Board.findOne({
         where: { id: req.params.id, member_id: req.user.id },
      })

      if (!board) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      //게시물 삭제
      await board.destroy()

      res.status(200).json({
         success: true,
         message: '게시물이 성공적으로 삭제되었습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 삭제 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시물 불러오기(id 조회) (localhost:8000/board/:id)
router.get('/:id', async (req, res, next) => {
   try {
      const board = await Board.findOne({
         where: { id: req.params.id },
         include: [
            {
               model: Member,
               attributes: ['id', 'nick'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })

      // 게시물을 가져오지 못했을때
      if (!board) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      res.status(200).json({
         success: true,
         board,
         message: '게시물을 성공적으로 불러왔습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '특정 게시물을 불러오는 중 오류가 발생했습니다.'
      next(error)
   }
})

//전체 게시물(페이징 기능)
router.get('/', async (req, res, next) => {
   try {
      const page = parseInt(req.query.page, 10) || 1 //페이지 번호
      const limit = parseInt(req.query.limit, 10) || 3 //한 번에 표시할 페이지 수
      const offset = (page - 1) * limit //오프셋 계산

      //게시물 레코드의 전체 갯수 가져오기
      const count = await Board.count()

      //게시물 레코드 가져오기
      const boards = await Board.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: Member,
               attributes: ['id', 'nick', 'email'],
            },
            {
               model: Hashtag,
               attributes: ['title'],
            },
         ],
      })
      console.log('boards: ', boards)

      res.status(200).json({
         success: true,
         boards,
         pagination: {
            totalBoards: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            limit,
         },
         message: '게시물 리스트 조회 성공',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 리스트 조회 중 오류가 발생했습니다.'
      next(error)
   }
})

module.exports = router
