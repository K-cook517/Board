import axios from 'axios'

const BASE_URL = import.meta.env.VITE_APP_API_URL

//axios 인스턴스 생성
const boardApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true,
})

//회원가입
export const registerMember = async (memberData) => {
   try {
      //memberData: 회원가입 창에서 입력한 데이터
      //localhost:8000/auth/join
      console.log('memberData: ', memberData)
      const response = await boardApi.post('/auth/join', memberData)

      console.log('response: ', response)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//로그인
export const loginMember = async (credential) => {
   try {
      console.log('credential: ', credential)
      const response = await boardApi.post('/auth/login', credential)

      console.log('response: ', response)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//로그아웃
export const logoutMember = async () => {
   try {
      const response = await boardApi.get('/auth/logout')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await boardApi.get('/auth/status')
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//포스트 등록
export const createBoard = async (boardData) => {
   try {
      //postData:등록할 게시물 데이터가 담겨져있는 formData 객체
      console.log('boardData: ', boardData)

      //서버에 파일 전송시 반드시 해야하는 headers 설정
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }

      const response = await boardApi.post('/post', boardData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//포스트 수정
export const updateBoard = async (id, boardData) => {
   try {
      //id: board의 id, postData: 수정할 게시물 데이터가 있는 객체

      //서버에 파일 전송 시 반드시 해야하는 headers 설정
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', //파일 전송시 반드시 지정
         },
      }

      const response = await boardApi.put(`/post/${id}`, boardData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//포스트 페이징 가져오기
export const getBoards = async (page) => {
   try {
      //page: 페이지 번호
      const response = await boardApi.get(`/post?page=${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//특정 포스트 가져오기
export const getBoardById = async (id) => {
   try {
      // id: 특정 board 의 id(PK)
      const response = await boardApi.get(`/post/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}

//포스트 삭제
export const deleteBoard = async (id) => {
   try {
      const response = await boardApi.delete(`/post/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error}`)
      throw error
   }
}
