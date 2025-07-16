const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { Post, Hashtag, Member } = require('../models')
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
         const ext = path.extname(decodeFileName) //확장자명 추출
         const basename = path.basename(decodeFileName, ext) //확장자 제거된 파일명 추출

         cb(null, basename + Date.now() + ext)
      },
   }),
   limits: { fileSize: 5 * 1024 * 1024 }, //파일 크기 5MB
})

//게시물 등록
router.post('/', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      //업로드 한 파일 없을 때
      if (!req.file) {
         const error = new Error('파일 업로드 실패')
         error.status = 400
         return next(error)
      }

      //게시물 등록
      const post = await Post.create({
         content: req.body.content,
         img: `${req.file.filename}`,
         member_id: req.member.id,
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
         await post.addHashtags(result.map((r) => r[0]))
      }
      res.status(200).json({
         success: true,
         post: {
            id: post.id,
            content: post.content,
            img: post.img,
            memberId: post.member_id,
         },
         message: '게시물 등록이 성공했습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 등록 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시물 수정 (localhost:8000/post/:id)
router.put('/:id', isLoggedIn, upload.single('img'), async (req, res, next) => {
   try {
      //1.게시물 존재여부 확인
      //select * from posts where id = ? and user_id = ? limit 1
      const post = await Post.findOne({
         where: { id: req.params.id, member_id: req.member_id },
      })
      if (!post) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }
      //post 테이블 수정
      await post.update({
         content: req.body.content,
         img: req.file ? `/${req.file.filename}` : post.img, //수정된 이미지가 있으면 바꿈
      })
      //hashtag 테이블 수정
      const hashtags = req.body.hashtags.match(/#[^\s#]*/g) // #을 기준으로 해시태그 추출

      if (hashtags) {
         const result = await Promise.all(
            hashtags.map((tag) =>
               Hashtag.findOrCreate({
                  where: { title: tag.slice(1) }, //#을 제외한 문자만
               })
            )
         )
         await post.setHashtags(result.map((r) => r[0]))
      }

      //수정 게시물 재조회(선택사항)
      const updatedPost = await Post.findOne({
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
         post: updatedPost,
         message: '게시물이 성공적으로 수정되었습니다.',
      })
   } catch (error) {
      error.status = 500
      error.message = '게시물 수정 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시물 삭제 (localhost:8000/post/:id)
router.delete('/:id', isLoggedIn, async (req, res, next) => {
   try {
   } catch (error) {
      error.status = 500
      error.message = '게시물 삭제 중 오류가 발생했습니다.'
      next(error)
   }
})

//게시물 불러오기(id 조회) (localhost:8000/post/:id)
router.get('/:id', async (req, res, next) => {
   try {
      const post = await Post.findOne({
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
      if (!post) {
         const error = new Error('게시물을 찾을 수 없습니다.')
         error.status = 404
         return next(error)
      }

      res.status(200).json({
         success: true,
         post,
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
      const limit = parseInt(req.query.page, 3) || 3 //한 번에 표시할 페이지 수
      const offset = (page - 1) * limit //오프셋 계산

      //게시물 레코드의 전체 갯수 가져오기
      const count = await Post.count()

      //게시물 레코드 가져오기
      const posts = await Post.findAll({
         limit,
         offset,
         order: [['createdAt', 'DESC']],
         include: [
            {
               model: Member,
               attributes: ['id', 'nick', 'email'],
            },
         ],
      })
      console.log('posts: ', posts)

      res.status(200).json({
         success: true,
         posts,
         pagination: {
            totalPosts: count,
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
