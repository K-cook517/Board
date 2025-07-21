import { Card, CardMedia, CardContent, Typography, Box, CardActions, Button, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import dayjs from 'dayjs' //날짜 시간 포맷해주는 패키지

import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { deleteBoardThunk } from '../../features/boardSlice'

function BoardItem({ board, isAuthenticated, member }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   //게시물 삭제
   const onClickDelete = (id) => {
      const result = confirm('삭제하시겠습니까?')

      if (result) {
         dispatch(deleteBoardThunk(id))
            .unwrap()
            .then(() => {
               navigate('/')
            })
            .catch((error) => {
               console.error('게시물 삭제 중 오류 발생: ', error)
               alert('게시물 삭제에 실패했습니다.', +error)
            })
      }
   }

   return (
      <Card style={{ margin: '20px 0' }}>
         <CardMedia sx={{ height: 240 }} image={`${import.meta.env.VITE_APP_API_URL}${board.img}`} title={board.content} />
         <CardContent>
            <Link to={`/my/${board.Member.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main' }}>@{board.Member.nick} </Typography>
            </Link>
            <Typography>{dayjs(board.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography>{board.content}</Typography>
         </CardContent>
         <CardActions>
            <Button size="small" color="primary">
               <FavoriteBorderIcon fontSize="small" />
            </Button>
            {/* isAuthenticated가 true 이면서 board.Member.id와 Member.id가 같을때 렌더링 => 내가 작성한 게시글만 수정, 삭제 */}
            {/* 로그인한 상태 이면서 로그인한 사람과 글을 작성한 사람이 같으면 렌더링 */}
            {isAuthenticated && board.Member.id === member.id && (
               <Box
                  sx={{
                     borderBottom: '1px solid #e0e0e0',
                     padding: '6px 10px',
                     fontSize: '0.9rem',
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     height: '40px',
                     overflow: 'hidden',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap',
                  }}
               >
                  <Link to={`/boards/edit/${board.id}`}>
                     <IconButton aria-label="edit" size="small">
                        <EditIcon fontSize="small" />
                     </IconButton>
                  </Link>
                  <IconButton aria-label="delete" size="small" onClick={() => onClickDelete(board.id)}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
               </Box>
            )}
         </CardActions>
      </Card>
   )
}

export default BoardItem
