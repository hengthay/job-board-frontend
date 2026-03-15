import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  candidateProfileData: {},
  status: 'idle',
  error: null,
}

export const fetchCandidateProfile = createAsyncThunk(
  'candidateProfile/fetchCandidateProfile', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/profiles`);

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to get candidate profile!');

      console.log('Candidate Profile - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch candidate profile - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const createCandidateProfile = createAsyncThunk(
  'candidateProfile/createCandidateProfile', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/profiles`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to created candidate profile!');

      console.log('Created Candidate Profile - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to create candidate profile - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateCandidateProfile = createAsyncThunk(
  'candidateProfile/updateCandidateProfile', async ({ id, formData }, thunkAPI) => {
    try {
      
      const res = await axiosInstance.put(`${API_BASE_URL}/profiles/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to updated candidate profile!');

      console.log('Updated Candidate Profile - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update candidate profile - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeCandidateProfile = createAsyncThunk(
  'candidateProfile/removeCandidateProfile', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/profiles/${id}`);

      if(res?.status === 200 || res?.status === 204) {
        return {
          message: 'Success',
          id
        }
      };
      
      if(res?.data?.data) {
        return {
          message: 'Success',
          id
        }
      };

      return thunkAPI.rejectWithValue(`Failed to remove candidate profile with id:${id}`);

    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to remove candidate profile with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const candidateProfileSlice = createSlice({
  name: "candidateProfile",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchCandidateProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.candidateProfileData = action.payload;
      })
      .addCase(fetchCandidateProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!';
        state.status = 'loading';
      })
      .addCase(createCandidateProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(createCandidateProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.candidateProfileData = [...state.candidateProfileData, action.payload];
      })
      .addCase(createCandidateProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!';
        state.status = 'loading';
      })
      .addCase(updateCandidateProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(updateCandidateProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const updated = action.payload;

        state.candidateProfileData = state.candidateProfileData.map((profile) => profile.id === updated.id ? updated : profile);
      })
      .addCase(updateCandidateProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!';
        state.status = 'loading';
      })
      .addCase(removeCandidateProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(removeCandidateProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const deletedId = action.payload;

        state.candidateProfileData = state.candidateProfileData.filter((profile) => profile.id !== deletedId);
      })
      .addCase(removeCandidateProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!';
        state.status = 'loading';
      })
  }
})

export default candidateProfileSlice.reducer;
export const selectCandidateProfileData = (state) => state.candidateProfile.candidateProfileData;
export const selectCandidateProfileStatus = (state) => state.candidateProfile.status;
export const selectCandidateProfileError = (state) => state.candidateProfile.error;
