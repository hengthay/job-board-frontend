import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  userData: [],
  status: 'idle',
  error: null
}

export const loginUser = createAsyncThunk(
  'auths/loginUser', async ({ payload }, thunkAPI) => {
    try {
      console.log('payload in redux', payload);
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
      const res = await axiosInstance.post(`${API_BASE_URL}/logout`, {}, {
        withCredentials: true
      });

      return res?.data?.data ?? {message: "Logged out"};
    } catch (error) {
      console.log('Failed to logout user - ', error);
      const msg = error?.response?.data?.message;
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const authSlice = createSlice({
  name: "auths",
  initialState,
  reducers: {

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
      })
      .addCase(loginUser.rejected, (state) => {
        state.error = 'Unable to login due to Internal Server!';
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
      })
      .addCase(logoutUser.rejected, (state) => {
        state.error = 'Unable to login due to Internal Server!';
        state.status = 'failed';
      })
  }
})

export default authSlice.reducer;
export const selectUser = state => state.auths.userData;
export const selectUserStatus = state => state.auths.status;
export const selectUserError = state => state.auths.error;