import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  saveJobData: [],
  status: "idle",
  error: null,

  // Save job detail
  saveJobDataDetail: null,
  statusDetail: 'idle',
};

export const fetchSavedJob = createAsyncThunk(
  'saveJobs/fetchSavedJob', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/save-jobs`)

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Failed to fetch save jobs, there is not data found!');
      }

      console.log('saved job - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch all saved job - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchSavedJobById = createAsyncThunk(
  'saveJobs/fetchSavedJobById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/save-jobs/${id}`)

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to fetch save jobs by id:${id} is not found!`);
      }

      console.log('saved job detail - ', res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to fetch saved job by id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const saveFavoriteJob = createAsyncThunk(
  'saveJobs/saveFavoriteJob', async (jobId, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/save-jobs`, {
        job_id: jobId
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to Save favorite job!`);
      }

      console.log('Favorite job saved - ', res?.data);

      return res?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to save favorite job - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateSaveFavoriteJob = createAsyncThunk(
  'saveJobs/updateSaveFavoriteJob', async ({id, formData}, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/save-jobs/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to update Save favorite job!`);
      }

      console.log('Updated favorite job saved - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update save favorite job - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const unsaveFavoriteJob = createAsyncThunk(
  'saveJobs/unsaveFavoriteJob', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/save-jobs/${id}`);

      if(res?.status === 200 || res?.status === 204) return id;

      if(res?.data?.data) return id;

      return thunkAPI.rejectWithValue('Failed to unsave favorite job!');
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update save favorite job - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const saveJobSlice = createSlice({
  name: "saveJobs",
  initialState,
  reducers: {
    resetSaveJobStatus: (state) => {
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedJob.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchSavedJob.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.saveJobData = action.payload;
      })
      .addCase(fetchSavedJob.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(fetchSavedJobById.pending, (state) => {
        state.error = null;
        state.statusDetail = 'loading';
      })
      .addCase(fetchSavedJobById.fulfilled, (state, action) => {
        state.error = null;
        state.statusDetail = 'succeeded';
        state.saveJobDataDetail = action.payload;
      })
      .addCase(fetchSavedJobById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.statusDetail = 'failed';
      })
      .addCase(saveFavoriteJob.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(saveFavoriteJob.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.saveJobData = [...state.saveJobData, action.payload];
      })
      .addCase(saveFavoriteJob.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(updateSaveFavoriteJob.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(updateSaveFavoriteJob.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const updated = action.payload;

        state.saveJobData = state.saveJobData.map((save) => save.id === updated.id ? updated : save);
        state.saveJobDataDetail = updated;
      })
      .addCase(updateSaveFavoriteJob.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(unsaveFavoriteJob.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(unsaveFavoriteJob.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const deletedId = action.payload;

        state.saveJobData = state.saveJobData.filter((save) => save.id !== deletedId);

        if(state?.saveJobDataDetail?.id === deletedId.id) {
          state.saveJobDataDetail = null;
        }
      })
      .addCase(unsaveFavoriteJob.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
  }
})

export default saveJobSlice.reducer;
export const { resetSaveJobStatus } = saveJobSlice.actions;
export const selectSaveJobData = (state) => state.saveJobs.saveJobData;
export const selectSaveJobStatus = (state) => state.saveJobs.status;
export const selectSaveJobError = (state) => state.saveJobs.error;
export const selectSaveJobDataDetail = (state) => state.saveJobs.saveJobDataDetail;
export const selectSaveJobStatusDetail = (state) => state.saveJobs.statusDetail;