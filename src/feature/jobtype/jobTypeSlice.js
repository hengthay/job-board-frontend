import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  jobTypeData: [],
  status: 'idle',
  error: null,

  // Detail
  jobTypeDataDetail: null,
  statusDetail: "idle"
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
);
export const fetchJobTypeById = createAsyncThunk(
  'jobTypes/fetchJobTypeById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/jobtypes/${id}`);

      if(!res?.data?.data || res.data.data.length === 0) {
        return thunkAPI.rejectWithValue(`Job-Type with id:${id} not found!`);
      }

      // console.log('Job Types detail- ', res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get job types detail - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const createJobType = createAsyncThunk(
  'jobTypes/createJobType', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/admin/jobtypes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Erorr to create new job-types!");
      }

      // console.log('Job-Type Created: ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to create job types - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateJobType = createAsyncThunk(
  'jobTypes/updateJobType', async ({ id, formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstance.put(`${API_BASE_URL}/admin/jobtypes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Erorr to update new job-types!");
      }

      // console.log('Job-Type updated: ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update job types - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeJobType = createAsyncThunk(
  'jobTypes/removeJobType', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/admin/jobtypes/${id}`);

      if(res?.data?.data) return id;

      if(res?.status === 200 || res?.status === 204) return id;

      return thunkAPI.rejectWithValue("Error to delete job types!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to delete job types - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const jobTypeSlice = createSlice({
  name: 'jobTypes',
  initialState,
  reducers: {
    resetJobTypeStatus: (state) => {
      state.status = 'idle';
    }
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
      .addCase(fetchJobTypes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(fetchJobTypeById.pending, (state) => {
        state.statusDetail = 'loading';
        state.error = null;
      })
      .addCase(fetchJobTypeById.fulfilled, (state, action) => {
        state.statusDetail = 'succeeded';
        state.error = null;
        state.jobTypeDataDetail = action.payload;
      })
      .addCase(fetchJobTypeById.rejected, (state, action) => {
        state.statusDetail = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(createJobType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createJobType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.jobTypeData = [...state.jobTypeData, action.payload];
      })
      .addCase(createJobType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(updateJobType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateJobType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updated = action.payload;

        state.jobTypeData = state.jobTypeData.map((type) => type.id === updated.id ? updated : type);

        state.jobTypeDataDetail = updated;
      })
      .addCase(updateJobType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(removeJobType.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeJobType.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const deletedId = action.payload;

        state.jobTypeData = state.jobTypeData.filter((type) => type.id !== deletedId);

        if(state.jobTypeDataDetail?.id === deletedId.id) {
          state.jobTypeDataDetail = null;
        }
      })
      .addCase(removeJobType.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
  }
});

export default jobTypeSlice.reducer;
export const { resetJobTypeStatus } = jobTypeSlice.actions;
export const selectJobTypes = state => state.jobTypes.jobTypeData;
export const selectJobTypeStatus = state => state.jobTypes.status;
export const selectJobTypeError = state => state.jobTypes.error;
export const selectJobTypeDataDetail = state => state.jobTypes.jobTypeDataDetail;
export const selectJobTypeStatusDetail = state => state.jobTypes.statusDetail;