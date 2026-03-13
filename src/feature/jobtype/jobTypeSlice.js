import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  jobTypeData: [],
  status: 'idle',
  error: null,
}

export const fetchJobTypes = createAsyncThunk(
  'jobTypes/fetchJobTypes', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/jobtypes`);

      if(!res?.data?.data || res.data.data.length === 0) {
        return thunkAPI.rejectWithValue('Job Types did not contain any data!');
      }

      // console.log('Job Types - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get job types data - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const jobTypeSlice = createSlice({
  name: 'jobTypes',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobTypes.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobTypes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.jobTypeData = action.payload;
      })
      .addCase(fetchJobTypes.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Unable to get all job types due to Internal Server Error!';
      })
  }
});

export default jobTypeSlice.reducer;
export const selectJobTypes = state => state.jobTypes.jobTypeData;
export const selectJobTypeStatus = state => state.jobTypes.status;
export const selectJobTypeError = state => state.jobTypes.error;