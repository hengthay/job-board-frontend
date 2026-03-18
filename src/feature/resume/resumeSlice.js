import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  resumeData: [],
  status: "idle",
  error: null,

  // Resume detail
  resumeDataDetail: null,
  statusDetail: "idle",
};

export const fetchResumes = createAsyncThunk(
  'resumes/fetchResumes', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/resumes`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Failed to fetch resumes data, there is no data found!");
      }

      console.log("resumes data - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch resumes data - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchResumesById = createAsyncThunk(
  'resumes/fetchResumesById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/resumes/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to fetch resumes by id:${id} is not found!`);
      }

      console.log("resumes data detail - ", res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch resumes data detail - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createResume = createAsyncThunk(
  'resumes/createResume', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/resumes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to create resume!`);
      }

      console.log("resumes created - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to create resume - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateResume = createAsyncThunk(
  'resumes/updateResume', async ({id ,formData}, thunkAPI) => {
    try {
      
      const res = await axiosInstance.put(`${API_BASE_URL}/resumes/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to update resume!`);
      }

      console.log("resumes updated - ", res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update resume - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeResume = createAsyncThunk(
  'resumes/removeResume', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/resumes/${id}`);

      if(res?.status === 200 || res?.status === 204) return id;

      if(res?.data?.data) return id;

      return thunkAPI.rejectWithValue(`Failed to delete resume with id:${id}!`);
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to delete resume with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const resumeSlice = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    clearResumeDetail: (state) => {
      state.resumeDataDetail = null;
      state.statusDetail = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        state.resumeData = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(fetchResumesById.pending, (state) => {
        state.error = null;
        state.statusDetail = "loading";
      })
      .addCase(fetchResumesById.fulfilled, (state, action) => {
        state.error = null;
        state.statusDetail = "succeeded";
        state.resumeDataDetail = action.payload;
      })
      .addCase(fetchResumesById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.statusDetail = "failed";
      })
      .addCase(createResume.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        state.resumeData = [...state.resumeData, action.payload];
      })
      .addCase(createResume.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(updateResume.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const updated = action.payload;

        state.resumeData = state.resumeData.map((resume) => resume.id === updated.id ? updated : resume);

        state.resumeDataDetail = updated;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
      .addCase(removeResume.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(removeResume.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const deletedId = action.payload;

        state.resumeData = state.resumeData.filter((resume) => resume.id !== deletedId);

        if(state.resumeDataDetail?.id === deletedId.id) {
          state.resumeDataDetail = null;
        }
      })
      .addCase(removeResume.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong!";
        state.status = "failed";
      })
  }
});

export default resumeSlice.reducer;
export const { clearResumeDetail } = resumeSlice.actions;
export const selectResumeData = (state) => state.resumes.resumeData;
export const selectResumeStatus = (state) => state.resumes.status;
export const selectResumeErorr = (state) => state.resumes.error;
export const selectResumeDataDetail = (state) => state.resumes.resumeDataDetail;
export const selectResumeDetailStatus = (state) => state.resumes.statusDetail;