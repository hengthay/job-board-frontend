import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  companySocialData: [],
  status: 'idle',
  error: null,

  // Company social data detail
  companySocialDataDetail: null,
  statusDetail: "idle"
}

export const fetchCompanySocial = createAsyncThunk(
  'companySocials/fetchCompanySocial', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/company-socials`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue('Failed to fetch Company social data, there is no data found!')
      }

      console.log('Company-Social - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch company social data - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const fetchCompanySocialById = createAsyncThunk(
  'companySocials/fetchCompanySocialById', async (id, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`${API_BASE_URL}/company-socials/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue(`Failed to fetch Company social data withd id:${id}, there is no data found!`)
      }

      console.log('Company-Social detail - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to fetch company social with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const createCompanySocial = createAsyncThunk(
  'companySocials/createCompanySocial', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/company-socials`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Failed to create company socials!");
      }

      console.log('Company social created - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to create company social - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const updateCompanySocial = createAsyncThunk(
  'companySocials/updateCompanySocial', async ({ id, formData }, thunkAPI) => {
    try {

      const res = await axiosInstance.put(`${API_BASE_URL}/company-socials/${id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Failed to update company socials!");
      }

      console.log('Company social updated - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to update company social - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeCompanySocial = createAsyncThunk(
  'companySocials/removeCompanySocial', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/company-socials/${id}`);

      if(res?.status === 200 || res?.status === 204) return id;

      if(res?.data?.data) return id;

      return thunkAPI.rejectWithValue("Failed to remove company social with id:", id);
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to remove company social with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const companySocialSlice = createSlice({
  name: 'companySocials',
  initialState,
  reducers: {
    resetCompanySocial: (state) => {
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanySocial.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchCompanySocial.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        state.companySocialData = action.payload;
      })
      .addCase(fetchCompanySocial.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";;
        state.status = "failed";
      })
      .addCase(fetchCompanySocialById.pending, (state) => {
        state.error = null;
        state.statusDetail = "loading";
      })
      .addCase(fetchCompanySocialById.fulfilled, (state, action) => {
        state.error = null;
        state.statusDetail = "succeeded";
        state.companySocialDataDetail = action.payload;
      })
      .addCase(fetchCompanySocialById.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";;
        state.statusDetail = "failed";
      })
      .addCase(createCompanySocial.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(createCompanySocial.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        state.companySocialData = [...state.companySocialData, action.payload];
      })
      .addCase(createCompanySocial.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.status = "failed";
      })
      .addCase(updateCompanySocial.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(updateCompanySocial.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const updated = action.payload;
        // Mapping to update data
        state.companySocialData = state.companySocialData.map((company) => company.id === updated.id ? updated : company);
        // Update data detail
        state.companySocialDataDetail = updated;
      })
      .addCase(updateCompanySocial.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.status = "failed";
      })
      .addCase(removeCompanySocial.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(removeCompanySocial.fulfilled, (state, action) => {
        state.error = null;
        state.status = "succeeded";
        const deletedId = action.payload;
        // filtered out matching data
        state.companySocialData = state.companySocialData.filter((company) => company.id !== deletedId);
        // Update data detail
        if(state.companySocialDataDetail?.id === deletedId) {
          state.companySocialDataDetail = null;
        }
      })
      .addCase(removeCompanySocial.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
        state.status = "failed";
      })
  } 
})

export default companySocialSlice.reducer;
export const { resetCompanySocial } = companySocialSlice.actions;
export const selectCompanySocialData = (state) => state.companySocials.companySocialData;
export const selectCompanySocialStatus = (state) => state.companySocials.status;
export const selectCompanySocialError = (state) => state.companySocials.error;
export const selectCompanySocialDataDetail = (state) => state.companySocials.companySocialDataDetail;
export const selectCompanySocialDataDetailStatus = (state) => state.companySocials.statusDetail;