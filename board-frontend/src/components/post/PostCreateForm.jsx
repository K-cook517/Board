import { TextField, Button, Box } from '@mui/material'
import { useState } from 'react'

function PostCreateForm({ onPostCreate }) {
   const [imgUrl, setImgUrl] = useState('') //이미지 경로(파일명 포함)
   const [imgFile, setImgFile] = useState(null) //이미지 파일 객체
   const [content, setContent] = useState('') //게시물 내용
   const [hashtags, setHashtags] = useState('') //해시태그

   //업로드 이미지 미리보기
   const handleImageChange = (e) => {
      const file = e.target.files && e.target.files[0]
      if (!file) return
      setImgFile(file)

      //업로드 파일 미리보기
      const reader = new FileReader()
      reader.readAsDataURL(file) //업로드한 파일을 Base64 URL로 인코딩

      //onLoad(): 파일을 성공적으로 읽은 후에 실행되는 함수
      reader.onload = (event) => {
         setImgUrl(event.target.result) //Base64 URL을 imgUrl state에 저장
      }
   }

   //작성한 내용 전송
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!content.trim()) {
         alert('내용을 입력하세요.')
         return
      }

      if (!hashtags.trim()) {
         alert('해시태그를 입력하세요.')
         return
      }

      if (!imgFile) {
         alert('이미지 파일을 추가하세요.')
         return
      }

      // 데이터는 formData객체에 담겨 서버로 전송됨
      const formData = new FormData() //폼 데이터를 쉽게 생성하고 전송할 수 있도록 하는 객체

      //append(name, 값): 전송할 값들을 저장
      formData.append('content', content) //게시물 내용
      formData.append('hashtags', hashtags) //해시태그

      //파일명 인코딩(한글 파일명 깨짐 방지)
      const encodedFile = new File([imgFile], encodeURIComponent(imgFile.name), { type: imgFile.type })
      formData.append('img', encodedFile) //이미지 파일 추가

      onPostCreate(formData) //게시물 등록

      //   formData.forEach((value, key) => {
      //      console.log(key, value)
      //   })
   }

   return (
      <Box
         component="form"
         onSubmit={handleSubmit}
         encType="multipart/form-data"
         sx={{
            maxWidth: 600,
            mx: 'auto',
            mt: 5,
            p: 4,
            border: '1px solid #ccc',
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#fafafa',
         }}
      >
         {/* 이미지 업로드 필드 */}
         <Button variant="contained" component="label" sx={{ mt: 2 }}>
            이미지 업로드
            <input type="file" name="img" accept="image/*" hidden onChange={handleImageChange} />
         </Button>

         {imgUrl && (
            <Box mt={2} sx={{ textAlign: 'center' }}>
               <img
                  src={imgUrl}
                  alt="업로드 이미지 미리보기"
                  style={{
                     maxWidth: '100%',
                     maxHeight: '300px',
                     borderRadius: '8px',
                     border: '1px solid #ddd',
                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
               />
            </Box>
         )}

         {/* 게시물 내용 입력 필드 */}
         <TextField label="게시물 내용" variant="outlined" fullWidth multiline rows={4} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 3 }} />

         {/* 해시태그 입력 필드 */}
         <TextField label="해시태그 (# 구분)" variant="outlined" fullWidth value={hashtags} onChange={(e) => setHashtags(e.target.value)} placeholder="예: #여행 #음식 #일상" sx={{ mt: 2 }} />

         <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            등록하기
         </Button>
      </Box>
   )
}

export default PostCreateForm
