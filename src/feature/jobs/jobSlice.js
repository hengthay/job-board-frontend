import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  jobData: [],
  status: 'idle',
  error: null,
  // For job details
  jobDataDetail: null,
  statusDetail: 'idle',
  // For posting jobs
  jobPostingData: [],
  postingStatus: 'idle'
};

export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs', async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/jobs`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Jobs is not contain any data!');
      }

      // console.log(res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get all jobs - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchPostingJobs = createAsyncThunk(
  'jobs/fetchPostingJobs', async (_, thunkAPI) => {
    try {
      // Get state token for authenticate who fetch
      const state = thunkAPI.getState();
      const userData = state.auths.userData;
      const token = userData?.access_token;

      const res = await axiosInstance.get(`${API_BASE_URL}/jobs/all-postings`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('All of your posting jobs is empty!');
      }

      console.log(res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get all posting jobs - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const postJob = createAsyncThunk(
  'jobs/postJob', async (formData, thunkAPI) => {
    try {
      console.log('redux formData ', formData);
      // Access the global state using getState()
      const state = thunkAPI.getState();
      
      // Access the userData from your auths slice
      const userData = state.auths.userData; 
      const token = userData?.access_token;

      if(!token) {
        return thunkAPI.rejectWithValue('Token is not received! Please log in.');
      }

      const res = await axiosInstance.post(`${API_BASE_URL}/jobs`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Unable to create a new job!');
      }

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to post a new jobs - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob', async ({id, formData}, thunkAPI) => {
    try {
      // Access the global state using getState()
      const state = thunkAPI.getState();
      console.log('Update Job id: ', id);
      // Access the userData from your auths slice
      const userData = state.auths.userData; 
      const token = userData?.access_token;

      if(!token) {
        return thunkAPI.rejectWithValue('Token is not received! Please log in.');
      }

      if(!id) {
        return thunkAPI.rejectWithValue('ID is not received to updated!');
      }

      const res = await axiosInstance.put(`${API_BASE_URL}/jobs/${id}`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Unable to update job with id', $id);
      }

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update a jobs - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob', async (id, thunkAPI) => {
    try {
      // Get access_token from state
      // Access the global state using getState()
      const state = thunkAPI.getState();
      
      // Access the userData from your auths slice
      const userData = state.auths.userData; 
      const token = userData?.access_token;
      console.log('Delete Job id: ', id);

      if(!token) {
        return thunkAPI.rejectWithValue('Token is not received!');
      }
      
      if(!id) {
        return thunkAPI.rejectWithValue('ID is not received to deleted!');
      }

      await axiosInstance.delete(`${API_BASE_URL}/jobs/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      return {
        message: `Job with id:${id} is successfully deleted!`
      };
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to delete a jobs - ', msg);
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
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
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
      .addCase(fetchIndividualJob.rejected, (state, action) => {
        state.statusDetail = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(fetchPostingJobs.pending, (state) => {
        state.postingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchPostingJobs.fulfilled, (state, action) => {
        state.postingStatus = 'succeeded';
        state.error = null;
        state.jobPostingData = action.payload;
      })
      .addCase(fetchPostingJobs.rejected, (state, action) => {
        state.postingStatus = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(postJob.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.jobData = [...state.jobData, action.payload];
      })
      .addCase(postJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(updateJob.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // Stored new update data
        const updated = action.payload;
        // Assign new map data looping for updating
        state.jobData = state.jobData.map((job) => job.id === updated.id ? updated : job);
        // Assign new updated to job details
        state.jobDataDetail = updated;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(deleteJob.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // Store delete job id
        const deletedId = action.payload;
        // Filtered out removed data
        state.jobData = state.jobData.filter((job) => job.id !== deletedId);
        // Check if job detail equal to deletedId then we assign it to null
        if(state.jobDataDetail.id === deletedId) {
          state.jobDataDetail = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Something went wrong';
      })
  }
});

export default jobSlice.reducer;
export const selectJobs = (state) => state.jobs.jobData;
export const selectJobStatus = (state) => state.jobs.status;
export const selectJobError = (state) => state.jobs.error;
export const selectJobDetail = (state) => state.jobs.jobDataDetail;
export const selectJobStausDetail = (state) => state.jobs.statusDetail;
export const selectJobPostingData = (state) => state.jobs.jobPostingData;
export const selectJobPostingStatus = (state) => state.jobs.postingStatus;