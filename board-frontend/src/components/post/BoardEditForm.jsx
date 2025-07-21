import { TextField, Button, Box } from '@mui/material'
import { useState } from 'react'

function BoardEditForm({ onBoardEdit, initialValues = {} }) {
   const [imgUrl, setImgUrl] = useState(import.meta.env.VITE_APP_API_URL + initialValues.img) // 이미지 경로(파일명 포함)
   const [imgFile, setImgFile] = useState(null) // 이미지 파일 객체
   const [title, setTitle] = useState(initialValues.title) // 제목 내용
   const [content, setContent] = useState(initialValues.content) // 게시물 내용
   const [hashtags, setHashtags] = useState(initialValues.Hashtags.map((tag) => `#${tag.title}`).join(' ')) //해시태그 문자열 생성

   //이미지 미리 보기
   const handleImageChange = (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return //파일이 없는 경우 함수 종료
      setImgFile(file) //업로드한 파일 객체 state에 저장

      //이미지 파일 미리보기
      const reader = new FileReader()
      reader.readAsDataURL(file) //업로드한 파일을 Base64 URL로 인코딩
      reader.onload = (event) => {
         setImgUrl(event.target.result) //Base64 URL을 imgUrl state에 저장
      }
   }

   //작성한 내용 전송
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!title.trim()) {
         alert('내용을 입력하세요.')
         return
      }
      if (!content.trim()) {
         alert('내용을 입력하세요.')
         return
      }

      if (!hashtags.trim()) {
         alert('해시태그를 입력하세요.')
         return
      }
      const formData = new FormData()

      //append(name, 값): 전송할 값들을 저장
      formData.append('title', title) //게시물 내용
      formData.append('content', content) //게시물 내용
      formData.append('hashtags', hashtags) //해시태그

      if (imgFile) {
         //파일명 인코딩(한글 파일명 깨짐 방지)
         const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })
         formData.append('img', encodedFile) //이미지 파일 추가
      }
      onBoardEdit(formData) //게시물 수정
   }

   return (
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }} encType="multipart/form-data">
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label">
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2}>
               <img src={imgUrl} alt="업로드 이미지 미리보기" style={{ width: '400px' }} />
            </Box>
         )}
         {/* 제목 내용 입력 필드 */}
         <TextField label="제목 내용" variant="outlined" fullWidth multiline rows={1} value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 2 }} />

         {/* 해시태그 입력 필드 */}
         <TextField label="해시태그 (# 구분)" variant="outlined" fullWidth value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="예: #여행 #음식 #일상" sx={{ mt: 2 }} />

         <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            등록하기
         </Button>
      </Box>
   )
}

export default BoardEditForm
