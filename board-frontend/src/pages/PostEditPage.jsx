import { Container } from '@mui/material'
import BoardEditForm from '../components/post/BoardEditForm'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardByIdThunk, updateBoardThunk } from '../features/boardSlice'

function BoardEditPage() {
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const { id } = useParams() //post의 id를 path 파라메터에서 가져옴
   const { board, loading, error } = useSelector((state) => state.boards)

   //게시물 데이터 불러오기
   useEffect(() => {
      dispatch(fetchBoardByIdThunk(id))
   }, [dispatch, id])

   //게시물 수정
   const onBoardEdit = (boardData) => {
      dispatch(updateBoardThunk({ id, boardData }))
         .unwrap()
         .then(() => {
            navigate('/') //게시물 수정 후 메인페이지로 이동
         })
         .catch((error) => {
            console.error('게시물 수정 중 오류 발생:', error)
            alert('게시물 수정에 실패했습니다.')
         })
   }

   if (loading) return <p>로딩 중...</p>

   return (
      <Container maxWidth="md">
         <h1>게시물 수정</h1>
         {board && <BoardEditForm onBoardEdit={onBoardEdit} initialValues={board} />}
      </Container>
   )
}

export default BoardEditPage
