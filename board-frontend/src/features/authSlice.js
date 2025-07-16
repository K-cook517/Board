import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { checkAuthStatus, loginMember, logoutMember, registerUser } from '../api/boardApi'

//회원가입
export const registerUserThunk = createAsyncThunk('auth/registerUser', async (memberData, { rejectWithValue }) => {
   try {
      const response = await registerUser(memberData)
      return response.data.member
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//로그인
export const loginMemberThunk = createAsyncThunk('auth/loginMember', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginMember(credentials)
      return response.data.member
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//로그아웃
export const logoutMemberThunk = createAsyncThunk('auth/logoutMember', async (_, { rejectWithValue }) => {
   try {
      const response = await logoutMember()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//로그인 상태 확인
export const checkAuthStatusThunk = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuthStatus()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      member: null, //사용자 정보 객체
      isAuthenticated: false, //로그인 상태(true: 로그인, false: 로그아웃)
      loading: false,
      error: null,
   },
   reducers: {
      //error state 초기화
      clearAuthError: (state) => {
         state.error = null
      },
   },
   extraReducers: (builder) => {
      builder
         // 회원가입
         .addCase(registerUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(registerUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.member = action.payload
         })
         .addCase(registerUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //로그인
         .addCase(loginMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(loginMemberThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.member = action.payload
         })
         .addCase(loginMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //로그아웃
         .addCase(logoutMemberThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutMemberThunk.fulfilled, (state) => {
            state.loading = false
            state.isAuthenticated = false
            state.member = null //로그아웃 후 유저 정보 초기화
         })
         .addCase(logoutMemberThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //로그인 상태 확인
         .addCase(checkAuthStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkAuthStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            //로그인 상태일지 로그아웃 상태일지 할 수 없어 아래와 같이 값을 줌
            state.isAuthenticated = action.payload.isAuthenticated
            state.member = action.payload.member || null
         })
         .addCase(checkAuthStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.member = null
         })
   },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer
