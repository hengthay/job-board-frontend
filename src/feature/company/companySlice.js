import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE_URL, axiosInstance } from "../../components/AxiosInstance";

const initialState = {
  companyData: [],
  status: "idle",
  error: null,

  // All companies data
  allCompaniesData: [],
  companiesStatus: 'idle',

  // companies detail
  companyDetailData: null,
  companyStatus: 'idle',
};

export const fetchCompany = createAsyncThunk(
  'companies/fetchCompany', async (_, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/companies`);

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to fetch company!');

      console.log('Company data - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch company - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  'companies/fetchCompanyById', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/companies/${id}`);

      if(!res?.data?.data) return thunkAPI.rejectWithValue(`Failed to fetch company with id:${id}!`);

      console.log('Company data detail - ', res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch company - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const createCompanyProfile = createAsyncThunk(
  'companies/createCompanyProfile', async (formData, thunkAPI) => {
    try {
      
      const res = await axiosInstance.post(`${API_BASE_URL}/companies`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to create company profile!');

      console.log('Created Company profile - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to create company profile - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updateCompanyProfile = createAsyncThunk(
  'companies/updateCompanyProfile', async ({id, formData}, thunkAPI) => {
    try {
      
      const res = await axiosInstance.put(`${API_BASE_URL}/companies/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to update company profile!');

      console.log('Updated Company Profile - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to update company profile - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const removeCompanyProfile = createAsyncThunk(
  'companies/removeCompanyProfile', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/companies/${id}`);

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

      return thunkAPI.rejectWithValue(`Failed to remove company profile with id:${id}`);
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to remove company profile with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)


export const fetchAllCompanies = createAsyncThunk(
  'companies/fetchAllCompanies', async () => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/admin/companies`);

      if(!res?.data?.data) return thunkAPI.rejectWithValue('Failed to fetch company by admin!');

      console.log('Company data - ', res?.data?.data);

      return res?.data?.data ?? [];
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log('Error to fetch all companies - ', msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const findCompanyProfileByAdmin = createAsyncThunk(
  'companies/findCompanyProfileByAdmin', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.get(`${API_BASE_URL}/admin/companies/${id}`);

      if(!res?.data?.data) {
        return thunkAPI.rejectWithValue("Error to get company profile!");
      }

      console.log('Company Profile by Admin - ', res?.data?.data);

      return res?.data?.data ?? null;
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to get company profile with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

export const removeCompanyProfileByAdmin = createAsyncThunk(
  'companies/removeCompanyProfileByAdmin', async (id, thunkAPI) => {
    try {
      
      const res = await axiosInstance.delete(`${API_BASE_URL}/admin/companies/${id}`);

      if(res?.status === 200 || res?.status === 204) return id;

      if(res?.data?.data) return id;
      
      return thunkAPI.rejectWithValue("Error to delete Company Profile by Admin!");
    } catch (error) {
      const msg = error?.response?.data?.message;
      console.log(`Error to get company profile with id:${id} - `, msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
)

const companySlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    resetCompanyStatus: (state) => {
      state.status = 'idle'
    },
    resetAllCompaniesStatus: (state) => {
      state.companiesStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.companyData = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.status = 'failed';
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.error = null;
        state.companyStatus = 'loading';
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.error = null;
        state.companyStatus = 'succeeded';
        state.companyDetailData = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.status = 'failed';
      })
      .addCase(createCompanyProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(createCompanyProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        state.companyData = action.payload;
      })
      .addCase(createCompanyProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.status = 'failed';
      })
      .addCase(updateCompanyProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(updateCompanyProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        const updated = Array.isArray(action.payload) ? action.payload[0] : action.payload;
        // Ensure state.companyData is treated as an array
        if (Array.isArray(state.companyData)) {
            state.companyData = state.companyData.map((company) =>
              company.id === updated.id
                ? {
                    ...company,       // keep existing nested fields (company_social, user, etc.)
                    ...updated,       // overwrite with updated flat fields
                    company_social: updated.company_social ?? company.company_social,
                    user: updated.user ?? company.user,
                  }
                : company
            );
          } else {
            const existing = state.companyData;
            state.companyData = [{
              ...existing,
              ...updated,
              company_social: updated.company_social ?? existing.company_social,
              user: updated.user ?? existing.user,
            }];
          }
      })
      .addCase(updateCompanyProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.status = 'failed';
      })
      .addCase(removeCompanyProfile.pending, (state) => {
        state.error = null;
        state.status = 'loading';
      })
      .addCase(removeCompanyProfile.fulfilled, (state, action) => {
        state.error = null;
        state.status = 'succeeded';
        // Storing updated data
        const deletedId = action.payload;
        // Filtered out remove data
        state.companyData = state.companyData.filter((company) => company.id !== deletedId);
      })
      .addCase(removeCompanyProfile.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.status = 'failed';
      })

      // Admin method
      .addCase(fetchAllCompanies.pending, (state) => {
        state.error = null;
        state.companiesStatus = 'loading';
      })
      .addCase(fetchAllCompanies.fulfilled, (state, action) => {
        state.error = null;
        state.companiesStatus = 'succeeded';
        state.allCompaniesData = action.payload;
      })
      .addCase(fetchAllCompanies.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.companiesStatus = 'failed';
      })
      .addCase(findCompanyProfileByAdmin.pending, (state) => {
        state.error = null;
        state.companyStatus = 'loading';
      })
      .addCase(findCompanyProfileByAdmin.fulfilled, (state, action) => {
        state.error = null;
        state.companyStatus = 'succeeded';
        state.companyDetailData = action.payload;
      })
      .addCase(findCompanyProfileByAdmin.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.companyStatus = 'failed';
      })
      .addCase(removeCompanyProfileByAdmin.pending, (state) => {
        state.error = null;
        state.companiesStatus = 'loading';
      })
      .addCase(removeCompanyProfileByAdmin.fulfilled, (state, action) => {
        state.error = null;
        state.companiesStatus = 'succeeded';
        const deletedId = action.payload;

        state.allCompaniesData = state.allCompaniesData.filter((company) => company.id !== deletedId);

        if(state.companyDetailData?.id === deletedId) {
          state.companyDetailData = null
        }
      })
      .addCase(removeCompanyProfileByAdmin.rejected, (state, action) => {
        state.error = action.payload || 'Something went wrong!'
        state.companiesStatus = 'failed';
      })
  }
});

export default companySlice.reducer;
export const { resetCompanyStatus, resetAllCompaniesStatus } = companySlice.actions;
export const selectCompanyData = (state) => state.companies.companyData;
export const selectCompanyStatus = (state) => state.companies.status;
export const selectCompanyError = (state) => state.companies.error;
// Admin selector
export const selectCompanyDetailData = (state) => state.companies.companyDetailData;
export const selectCompanyDetailStatus = (state) => state.companies.companyStatus;

export const selectAllCompaniesData = (state) => state.companies.allCompaniesData;
export const selectCompaniesStatus = (state) => state.companies.companiesStatus;