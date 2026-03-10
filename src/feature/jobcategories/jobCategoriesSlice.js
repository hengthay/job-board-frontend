import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  jobCategoriesData: [],
  status: 'idle',
  error: null,
}

export const fetchJobCategories = createAsyncThunk(
  'jobCategories/fetchJobCategories', async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/jobcategories`);

      if(!res?.data?.data || res?.data?.data.length === 0) {
        return thunkAPI.rejectWithValue('Job Categories did not contain any data!');
      }

      console.log('Job Categories', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get job categories - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const jobCategoriesSlice = createSlice({
  name: 'jobCategories',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.jobCategoriesData = action.payload;
      })
      .addCase(fetchJobCategories.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Unable to get all job categories due to Internal Server Error!';
      })
  }
});


export default jobCategoriesSlice.reducer;
export const selectJobCategories = state => state.jobCategories.jobCategoriesData;
export const selectJobCategoriesStatus = state => state.jobCategories.status;
export const selectJobCategoriesError = state => state.jobCategories.error;