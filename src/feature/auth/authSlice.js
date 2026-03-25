import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";
import { isTokenExpired } from "../../components/Helper/tokenExpiredChecker";

const initialState = {
  userData: localStorage.getItem("userData") ? JSON.parse(localStorage.getItem('userData')) : null,
  status: 'idle',
  error: null
}

export const loginUser = createAsyncThunk(
  'auths/loginUser', async ({ payload }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/login`, payload, {
        withCredentials: true
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Failed to login');
      }

      return res?.data?.data ?? [];
    } catch (error) {
      console.log('Failed to login user - ', error.response);
      const msg = error?.response?.data?.message;
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auths/logoutUser', async (_, thunkAPI) => {
    try {
      // To get access_token from initialState
      const { auths: { userData } } = thunkAPI.getState();
      
      const token = userData?.access_token;
      // console.log(token);

      const res = await axiosInstance.post(`${API_BASE_URL}/logout`, {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return res?.data?.data ?? {message: "Logged out"};
    } catch (error) {
      console.log('Failed to logout user - ', error);
      const msg = error?.response?.data?.message;
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const registerUser = createAsyncThunk(
  'auths/registerUser', async ({ payload }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/register`, payload);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Failed to register');
      }

      console.log(res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      console.log('Failed to register user - ', error);
      const msg = error?.response?.data?.message;
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const authSlice = createSlice({
  name: "auths",
  initialState,
  reducers: {
    clearError: (state) => { 
      state.error = null; 
    },
    forceLogout: (state) => {
      state.userData = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem('userData');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = action.payload;
        // Persist to localStorage so refresh doesn't wipe the token
        localStorage.setItem('userData', JSON.stringify(action.payload));
        console.log(action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.status = 'failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = action.payload;
        localStorage.setItem('userData', JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state) => {
        state.error = 'Unable to register due to Internal Server!';
        state.status = 'failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.userData = null;
        // Clear persisted token on logout
        localStorage.removeItem('userData');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong';
        state.status = 'failed';
      })
  }
})

export const {clearError, forceLogout} = authSlice.actions;
export default authSlice.reducer;
export const selectUser = state => state.auths.userData;
export const selectUserStatus = state => state.auths.status;
export const selectUserError = state => state.auths.error;