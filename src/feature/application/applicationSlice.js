import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  applicationData: [],
  status: "idle",
  error: null,

  // Application data detail
  applicationDataDetail: [],
  statusDetail: "idle"
}

export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/applications`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Failed to fetch application data, because there are not data found!");
      }

      console.log("Application data - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.respones?.data?.message;
      console.log('Error to fetch applications data - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchApplicationById = createAsyncThunk(
  'applications/fetchApplicationById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/applications/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to fetch application by id:${id} is not found!`);
      }

      console.log("Application data detail - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.respones?.data?.message;
      console.log('Error to fetch applications data detail - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const applyApplication = createAsyncThunk(
  'applications/applyApplication', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/applications`, formData, {
       headers: {
        "Content-Type": "multipart/form-data"
       } 
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to apply application`);
      }

      console.log("Application applied - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.respones?.data?.message;
      console.log('Error to apply application - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateApplication = createAsyncThunk(
  'applications/updateApplication', async ({ id, formData }, thunkAPI) => {
    try {
      // Update split to 2 part
      // 1. if role user can be update only cover_letter
      // 2. if role employer or admin can be update status, employer_note, reviewed_at
      const res = await axiosInstance.put(`${API_BASE_URL}/applications/${id}`, formData, {
       headers: {
        "Content-Type": "multipart/form-data"
       } 
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to update application`);
      }

      console.log("Application updated - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.respones?.data?.message;
      console.log('Error to update application - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeApplicatoin = createAsyncThunk(
  'applications/removeApplicatoin', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/applications/${id}`);

      if(res?.status === 200 || res?.status === 204) return id;

      if(res?.data?.data) return id;

      return thunkAPI.rejectWithValue(`Failed to remove application with id:${id} !`);
    } catch (error) {
      const msg = error?.respones?.data?.message;
      console.log('Error to update application - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    resetApplications: (state) => {
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.applicationData = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(fetchApplicationById.pending, (state) => {
        state.error = null;
        state.statusDetail = 'loading';
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.error = null;
        state.statusDetail = 'succeeded';
        state.applicationDataDetail = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.statusDetail = 'failed';
      })
      .addCase(applyApplication.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(applyApplication.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.applicationData = [...state.applicationData ,action.payload];
      })
      .addCase(applyApplication.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(updateApplication.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const updated = action.payload;

        state.applicationData = state.applicationData.map((application) => application.id === updated.id ? updated : application);

        state.applicationDataDetail = updated;
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
      .addCase(removeApplicatoin.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(removeApplicatoin.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const deletedId = action.payload;

        state.applicationData = state.applicationData.filter((application) => application.id !== deletedId);

        if(state.applicationDataDetail?.id === deletedId.id) {
          state.applicationDataDetail = null;
        }
      })
      .addCase(removeApplicatoin.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = 'failed';
      })
  }
})

export default applicationSlice.reducer;
export const { resetApplications } = applicationSlice.actions;
export const selectApplicationData = (state) => state.applications.applicationData;
export const selectApplicationStatus = (state) => state.applications.status;
export const selectApplicationError = (state) => state.applications.error;
export const selectApplicationDataDetail = (state) => state.applications.applicationDataDetail;
export const selectApplicationDetailStatus = (state) => state.applications.statusDetail;