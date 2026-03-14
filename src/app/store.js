import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import jobReducer from "../feature/jobs/jobSlice"
import jobTypeReducer from "../feature/jobtype/jobTypeSlice";
import jobCategoriesReducer from "../feature/jobcategories/jobCategoriesSlice";

const store = configureStore({
  reducer: {
    auths: authReducer,
    jobs: jobReducer,
    jobTypes: jobTypeReducer,
    jobCategories: jobCategoriesReducer,
  }
});

export default store;