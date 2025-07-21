import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } from '../api/boardApi'

//게시물 등록
export const createBoardThunk = createAsyncThunk('boards/createBoard', async (boardData, { rejectWithValue }) => {
   try {
      console.log('boardData: ', boardData)
      const response = await createBoard(boardData)

      console.log(response)
      return response.data.board
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//게시물 수정
export const updateBoardThunk = createAsyncThunk('boards/updateBoard', async (data, { rejectWithValue }) => {
   try {
      const { id, boardData } = data
      console.log('data:', data)

      const response = await updateBoard(id, boardData)

      console.log(response)
      return response.data.board
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//게시물 삭제
export const deleteBoardThunk = createAsyncThunk('posts/deleteBoard', async (id, { rejectWithValue }) => {
   try {
      console.log('포스트 id: ', id)
      const response = await deleteBoard(id)

      console.log(response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//게시물 불러오기(id 조회)
export const fetchBoardByIdThunk = createAsyncThunk('posts/fetchBoardById', async (id, { rejectWithValue }) => {
   try {
      console.log('포스트 id: ', id)
      const response = await getBoardById(id)

      console.log(response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

//전체 게시물(페이징 기능)
export const fetchBoardsThunk = createAsyncThunk('posts/fetchBoards', async (page, { rejectWithValue }) => {
   try {
      console.log('page: ', page)
      const response = await getBoards(page)

      console.log(response)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message)
   }
})

const boardSlice = createSlice({
   name: 'boards',
   initialState: {
      board: null, //게시글 데이터
      boards: [], //게시글 리스트
      pagination: null, //페이징 객체
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      //게시물 등록
      builder
         .addCase(createBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createBoardThunk.fulfilled, (state, action) => {
            state.loading = false
            state.boards = action.payload //등록한 게시물 데이터
         })
         .addCase(createBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      //게시물 리스트 불러오기
      builder
         .addCase(fetchBoardsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.boards = action.payload.boards
            state.pagination = action.payload.pagination
         })
         .addCase(fetchBoardsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 특정 게시물 불러오기
      builder
         .addCase(fetchBoardByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchBoardByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload.board
         })
         .addCase(fetchBoardByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 게시물 수정
      builder
         .addCase(updateBoardThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateBoardThunk.fulfilled, (state, action) => {
            state.loading = false
            state.board = action.payload //수정한 게시물 데이터
         })
         .addCase(updateBoardThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default boardSlice.reducer
