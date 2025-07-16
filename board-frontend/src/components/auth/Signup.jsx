import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { clearAuthError, registerUserThunk } from '../../features/authSlice'

function Signup() {
   const [email, setEmail] = useState('') //이메일
   const [nick, setNick] = useState('') //닉네임
   const [password, setPassword] = useState('') //패스워드
   const [confirmPassword, setConfirmPassword] = useState('') //패스워드 확인
   const [isSignupComplete, setIsSignupComplete] = useState(false) //회원가입 완료 여부

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { loading, error } = useSelector((state) => state.auth)

   useEffect(() => {
      //회원가입 컴포넌트 벗어날 때 error state가 null로 초기화
      return () => {
         dispatch(clearAuthError())
      }
   }, [dispatch])

   //회원가입 버튼 클릭 시 실행
   const handleSignup = () => {
      //모든 필드 입력했나 확인
      if (!email.trim() || !nick.trim() || !password.trim() || !confirmPassword.trim()) {
         alert('모든 필드를 입력해주세요!')
         return
      }

      //비밀번호와 비밀번호 확인이 일치하나 확인
      if (password !== confirmPassword) {
         alert('비밀번호가 일치하지 않습니다!')
         return
      }
      dispatch(registerUserThunk({ email, nick, password }))
         .unwrap()
         .then(() => {
            //회원가입 성공시
            setIsSignupComplete(true)
         })
         .catch(() => {
            //회원가입 중 에러 발생시
            console.error('회원가입 에러: ', error)
         })
   }

   //회원가입 완료됐을 때 보일 컴포넌트
   if (isSignupComplete) {
      return (
         <Container
            maxWidth="sm"
            sx={{
               mt: 10,
               p: 4,
               border: '1px solid #ccc',
               borderRadius: 2,
               textAlign: 'center',
               boxShadow: 2,
               backgroundColor: '#f9f9f9',
            }}
         >
            <Typography variant="h4" gutterBottom align="center">
               회원가입이 완료되었습니다!
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
               로그인 페이지로 이동하거나 다른 작업을 계속 진행할 수 있습니다.
            </Typography>
            <Button
               variant="contained"
               color="primary"
               fullWidth
               sx={{ mt: 4 }}
               onClick={() => navigate('/login')} // 로그인 페이지로 이동
            >
               로그인 하러 가기
            </Button>
         </Container>
      )
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
            회원가입
         </Typography>

         {error && (
            <Typography color="error" align="center">
               {error}
            </Typography>
         )}
         <TextField label="이메일" fullWidth required margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ backgroundColor: '#fff' }} />

         <TextField label="닉네임" fullWidth required margin="normal" value={nick} onChange={(e) => setNick(e.target.value)} sx={{ backgroundColor: '#fff' }} />

         <TextField label="비밀번호" type="password" fullWidth required margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ backgroundColor: '#fff' }} />

         <TextField label="비밀번호 확인" type="password" fullWidth required margin="normal" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={{ backgroundColor: '#fff' }} />

         {/* 로딩 중이면 회원가입 버튼 비활성화 */}
         <Button variant="contained" color="primary" onClick={handleSignup} fullWidth disabled={loading} style={{ marginTop: '20px' }}>
            {loading ? <CircularProgress size={24} /> : '회원가입'}
         </Button>
      </Container>
   )
}

export default Signup
