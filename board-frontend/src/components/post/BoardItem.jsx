import { Typography, Box, IconButton } from '@mui/material'
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
      <Box
         sx={{
            borderBottom: '1px solid #ccc',
            px: 2,
            py: 1.5,
            display: 'flex',
            flexDirection: 'column',
            fontSize: '0.9rem',
            backgroundColor: 'rgba(255,255,255,0.85)',
            '&:hover': {
               backgroundColor: '#f9f9f9',
            },
         }}
      >
         <img
            src={`${import.meta.env.VITE_APP_API_URL}${board.img}`}
            alt={board.content}
            style={{
               width: '100%',
               maxHeight: '300px',
               objectFit: 'cover',
               borderRadius: '8px',
               marginBottom: '10px',
            }}
         />
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to={`/my/${board.Member.id}`} style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: 'primary.main', fontWeight: 600 }}>@{board.Member.nick}</Typography>
            </Link>
            <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{dayjs(board.createdAt).format('YYYY-MM-DD HH:mm')}</Typography>
         </Box>

         <Typography sx={{ mt: 0.5, mb: 1 }}>{board.content}</Typography>

         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <IconButton size="small">
               <FavoriteBorderIcon fontSize="small" />
            </IconButton>

            {isAuthenticated && board.Member.id === member.id && (
               <Box>
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
         </Box>
      </Box>
   )
}

export default BoardItem
