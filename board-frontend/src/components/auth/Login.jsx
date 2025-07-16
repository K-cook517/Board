import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { clearAuthError, loginMemberThunk } from '../../features/authSlice'

function Login() {
   const [email, setEmail] = useState('') // 이메일
   const [password, setPassword] = useState('') //비밀번호
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   useEffect(() => {
      //로그인 컴포넌트 벗어날 때 error state가 null로 초기화
      return () => {
         dispatch(clearAuthError())
      }
   }, [dispatch])

   //로그인 버튼 클릭 시
   const handleLogin = (e) => {
      e.preventDefault()
      if (!email.trim() || !password.trim()) {
         alert('정확한 이메일과 패스워드를 입력해주세요.')
         return
      }
      dispatch(loginMemberThunk({ email, password }))
         .unwrap()
         .then(() => navigate('/')) //로그인 성공 시 메인 페이지로 이동
         .catch((error) => console.error('로그인 실패: ', error))
   }

   return (
      <Container
         maxWidth="xs"
         sx={{
            mt: 10,
            backgroundColor: 'rgba(255,255,255,0.95)',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            border: '1px solid #ccc',
         }}
      >
         <Typography variant="h5" align="center" gutterBottom>
            로그인
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}

         <form onSubmit={handleLogin}>
            <TextField label="이메일" type="email" fullWidth required margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ backgroundColor: '#fff' }} />

            <TextField label="비밀번호" type="password" fullWidth required margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ backgroundColor: '#fff' }} />

            <Button
               type="submit"
               fullWidth
               variant="contained"
               sx={{
                  mt: 2,
                  backgroundColor: '#000',
                  color: '#fff',
                  '&:hover': {
                     backgroundColor: '#444',
                  },
               }}
            >
               {loading ? (
                  <CircularProgress
                     size={24}
                     sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                     }}
                  />
               ) : (
                  '로그인'
               )}
            </Button>
         </form>

         <p>
            계정이 없으신가요?
            <Link to="/signup">회원가입</Link>
         </p>
      </Container>
   )
}

export default Login
