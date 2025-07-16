import { Container, Typography, Pagination, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPostsThunk } from '../features/postSlice'
// import PostItem from '../components/post/PostItem'

function Home({ isAuthenticated, member }) {
   const [page, setPage] = useState(1) //현재 페이지
   const dispatch = useDispatch()
   const { posts, pagination, loading, error } = useSelector((state) => state.posts)

   useEffect(() => {
      dispatch(fetchPostsThunk(page)) // 전체 게시물 리스트 가져오기
   }, [dispatch, page])

   //페이지 변경
   const handlePageChange = (event, value) => {
      setPage(value)
   }
   return (
      <Container maxWidth="xs">
         <Typography variant="h4" align="center" gutterBottom>
            Home Feed
         </Typography>

         {loading && (
            <Typography variant="body1" align="center">
               로딩 중...
            </Typography>
         )}

         {error && (
            <Typography variant="body1" align="center" color="error">
               에러 발생: {error}
            </Typography>
         )}
         {/* {posts.length > 0 ? (
            <>
               {posts.map((post) => (
                  <PostItem key={post.id} post={post} isAuthenticated={isAuthenticated} member={member} />
               ))}
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} //총 페이지 수
                     page={page} //현재 페이지
                     onChange={handlePageChange} //페이지를 변경할 함수
                  />
               </Stack>
            </>
         ) : (
            //posts 데이터가 0개면서 로딩중이 아닐 때
            !loading && (
               <Typography variant="body1" align="center">
                  게시물이 없습니다.
               </Typography>
            )
         )} */}
      </Container>
   )
}

export default Home
