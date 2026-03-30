import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  jobCategoriesData: [],
  status: 'idle',
  error: null,

  // Job Category Detail
  jobCategoryDataDetail: null,
  statusDetail: "idle"
}

export const fetchJobCategories = createAsyncThunk(
  'jobCategories/fetchJobCategories', async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/jobcategories`);

      if(!res?.data?.data || res?.data?.data.length === 0) {
        return thunkAPI.rejectWithValue('Job Categories did not contain any data!');
      }

      // console.log('Job Categories', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get job categories - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchJobCategoryById = createAsyncThunk(
  'jobCategories/fetchJobCategoryById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/jobcategories/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Job Categories with id:${id} is not found!`);
      }

      // console.log('Job Category Detail - ', res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to get job category detail - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createJobCategory = createAsyncThunk(
  'jobCategories/createJobCategory', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/admin/jobcategories`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Error to create new job-category!");
      }

      // console.log('Job-Category Created - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to create job-category - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateJobCategory = createAsyncThunk(
  'jobCategories/updateJobCategory', async ({ id, formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstance.put(`${API_BASE_URL}/admin/jobcategories/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Error to update new job-category!");
      }

      // console.log('Job-Category Updated - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to updated job-category - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeJobCategory = createAsyncThunk(
  'jobCategories/removeJobCategory', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/admin/jobcategories/${id}`);

      if(res?.status === 200 || res?.status === 204) return id;

      if(res?.data?.data) return id;

      return thunkAPI.rejectWithValue("Error to delete job-category!")
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to updated job-category - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const jobCategoriesSlice = createSlice({
  name: 'jobCategories',
  initialState,
  reducers: {
    resetJobCategoryStatus: (state) => {
      state.status = 'idle';
    }
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
      .addCase(fetchJobCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(fetchJobCategoryById.pending, (state) => {
        state.statusDetail = 'loading';
        state.error = null;
      })
      .addCase(fetchJobCategoryById.fulfilled, (state, action) => {
        state.statusDetail = 'succeeded';
        state.error = null;
        state.jobCategoryDataDetail = action.payload;
      })
      .addCase(fetchJobCategoryById.rejected, (state, action) => {
        state.statusDetail = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(createJobCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createJobCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.jobCategoriesData = [...state.jobCategoriesData, action.payload];
      })
      .addCase(createJobCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(updateJobCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateJobCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const updated = action.payload;

        state.jobCategoriesData = state.jobCategoriesData.map((cate) => cate.id === updated.id ? updated : cate);

        state.jobCategoryDataDetail = updated;
      })
      .addCase(updateJobCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
      .addCase(removeJobCategory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(removeJobCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const deletedId = action.payload;

        state.jobCategoriesData = state.jobCategoriesData.filter((cate) => cate.id !== deletedId);

        if(state?.jobCategoryDataDetail?.id === deletedId.id) {
          state.jobCategoryDataDetail = null
        }
      })
      .addCase(removeJobCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Something went wrong!";
      })
  }
});


export default jobCategoriesSlice.reducer;
export const { resetJobCategoryStatus } = jobCategoriesSlice.actions;
export const selectJobCategories = state => state.jobCategories.jobCategoriesData;
export const selectJobCategoriesStatus = state => state.jobCategories.status;
export const selectJobCategoriesError = state => state.jobCategories.error;
export const selectJobCategoriesDataDetail = state => state.jobCategories.jobCategoryDataDetail;
export const selectJobCategoriesStatusDetail = state => state.jobCategories.statusDetail;