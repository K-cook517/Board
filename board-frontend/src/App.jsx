import './styles/common.css'
import Navbar from './components/shared/Navbar'
import Home from './pages/Home'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import PostCreatePage from './pages/PostCreatePage'
import PostEditPage from './pages/PostEditPage'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { checkAuthStatusThunk } from './features/authSlice'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, member } = useSelector((state) => state.auth) //로그인 상태, 로그인한 사용자 정보(로그아웃일 때 null)

   //새로고침시 redux에서 사용하는 state가 사라지므로 지속적인 로그인 상태 확인을 위해 사용
   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])
   return (
      <>
         <Navbar isAuthenticated={isAuthenticated} member={member} />
         <Routes>
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} member={member} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/posts/create" element={<PostCreatePage />} />
            <Route path="/posts/edit/:id" element={<PostEditPage />} />
         </Routes>
      </>
   )
}

export default App
