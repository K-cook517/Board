import { Container } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import PostCreateForm from '../components/post/PostCreateForm'
import { createPostThunk } from '../features/postSlice'

function PostCreatePage() {
   const navigate = useNavigate()
   const dispatch = useDispatch()

   const onPostCreate = (postData) => {
      //postData: formData 객체
      dispatch(createPostThunk(postData))
         .unwrap()
         .then(() => {
            navigate('/') //게시물 등록 후 메인 페이지로 이동
         })
         .catch((error) => {
            console.error('게시물 등록 에러: ', error)
            alert('게시물 등록에 실패했습니다. ' + error)
         })
   }

   return (
      <Container maxWidth="md">
         <h1>게시물 등록</h1>
         <PostCreateForm onPostCreate={onPostCreate} />
      </Container>
   )
}

export default PostCreatePage
