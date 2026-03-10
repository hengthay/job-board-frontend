import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  jobData: [],
  jobDataDetail: null,
  status: 'idle',
  statusDetail: 'idle',
  error: null
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs', async (_, thunkAPI) => {
    try {

      const res = await axiosInstance.get(`${API_BASE_URL}/jobs`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Jobs is not contain any data!');
      }

      console.log(res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get all jobs - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchIndividualJob = createAsyncThunk(
  'jobs/fetchIndividualJob', async (id, thunkAPI) => {
    try {

      const res = await axiosInstance.get(`${API_BASE_URL}/jobs/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Individual Job with id:${id} not found!`);
      }

      console.log(res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get all jobs - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.jobData = action.payload;
      })
      .addCase(fetchJobs.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Unable to get all jobs due to Internal Server Error!';
      })
      .addCase(fetchIndividualJob.pending, (state) => {
        state.statusDetail = 'loading';
        state.error = null;
      })
      .addCase(fetchIndividualJob.fulfilled, (state, action) => {
        state.statusDetail = 'succeeded';
        state.error = null;
        state.jobDataDetail = action.payload;
      })
      .addCase(fetchIndividualJob.rejected, (state) => {
        state.statusDetail = 'failed';
        state.error = 'Unable to get all jobs due to Internal Server Error!';
      })
  }
});

export default jobSlice.reducer;
export const selectJobs = (state) => state.jobs.jobData;
export const selectJobStatus = (state) => state.jobs.status;
export const selectJobError = (state) => state.jobs.error;
export const selectJobDetail = (state) => state.jobs.jobDataDetail;
export const selectJobStausDetail = (state) => state.jobs.statusDetail;