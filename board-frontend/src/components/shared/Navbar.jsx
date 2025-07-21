import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CreateIcon from '@mui/icons-material/Create'

import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logoutMemberThunk } from '../../features/authSlice'

function Navbar({ isAuthenticated, member }) {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   //로그아웃 버튼 누르면 로그아웃
   const handleLogout = () => {
      dispatch(logoutMemberThunk())
         .unwrap()
         .then(() => {
            navigate('/')
         })
         .catch((error) => {
            alert('로그아웃 실패:', error)
         })
   }

   return (
      <AppBar position="static" style={{ backgroundColor: '#fff', marginBottom: 50 }}>
         <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
               <Link to="/">
                  <img src="/images/logo.png" alt="로고" width="160" style={{ display: 'inline-block', marginTop: '15px' }} />
               </Link>
            </Typography>
            {isAuthenticated ? (
               //로그아웃
               <>
                  <Link to="/boards/create">
                     <IconButton aria-label="글쓰기">
                        <CreateIcon />
                     </IconButton>
                  </Link>
                  <Link to="/my" style={{ textDecoration: 'none' }}>
                     <Typography variant="body1" style={{ marginRight: '20px', color: 'black' }}>
                        {/* ?(optional chaining): 값이 undefined 이거나 null일때 에러를 반환하지 않고 그냥 undefined를 반환 */}
                        {member?.nick}님
                     </Typography>
                  </Link>
                  <Button onClick={handleLogout} variant="outlined">
                     로그아웃
                  </Button>
               </>
            ) : (
               <Link to="/login">
                  <Button variant="contained">로그인</Button>
               </Link>
            )}
         </Toolbar>
      </AppBar>
   )
}

export default Navbar
