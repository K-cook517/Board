import { Container, Typography, Pagination, Stack, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardsThunk } from '../features/boardSlice'
import BoardItem from '../components/post/BoardItem'

function Home({ isAuthenticated, member }) {
   const [page, setPage] = useState(1) //현재 페이지
   const dispatch = useDispatch()
   const { boards, pagination, loading, error } = useSelector((state) => state.boards)

   useEffect(() => {
      dispatch(fetchBoardsThunk(page)) // 전체 게시물 리스트 가져오기
   }, [dispatch, page])

   //페이지 변경
   const handlePageChange = (event, value) => {
      setPage(value)
   }
   return (
      <Container
         maxWidth="sm"
         sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            padding: '32px',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            minHeight: '80vh',
         }}
      >
         <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
               backgroundColor: '#222',
               color: '#fff',
               padding: '12px 24px',
               borderRadius: 1,
               letterSpacing: 1,
               boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
         >
            Home Feed
         </Typography>

         {loading && (
            <Typography variant="body1" align="center" sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1 }}>
               로딩 중...
            </Typography>
         )}

         {error && (
            <Typography variant="body1" align="center" sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1 }}>
               에러 발생: {error}
            </Typography>
         )}
         {boards.length > 0 ? (
            <Box
               sx={{
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  overflow: 'hidden',
               }}
            >
               {boards.map((board) => (
                  <BoardItem key={board.id} board={board} isAuthenticated={isAuthenticated} member={member} />
               ))}
               <Stack spacing={2} sx={{ mt: 3, alignItems: 'center' }}>
                  <Pagination
                     count={pagination.totalPages} //총 페이지 수
                     page={page} //현재 페이지
                     onChange={handlePageChange} //페이지를 변경할 함수
                  />
               </Stack>
            </Box>
         ) : (
            //boards 데이터가 0개면서 로딩중이 아닐 때
            !loading && (
               <Typography variant="body1" align="center">
                  게시물이 없습니다.
               </Typography>
            )
         )}
      </Container>
   )
}

export default Home
