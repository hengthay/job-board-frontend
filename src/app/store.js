import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import jobReducer from "../feature/jobs/jobSlice"
import jobTypeReducer from "../feature/jobtype/jobTypeSlice";
import jobCategoriesReducer from "../feature/jobcategories/jobCategoriesSlice";
import companyReducer from "../feature/company/companySlice";
import candidateProfileReducer from "../feature/candidateProfile/candidateProfileSlice";
import companySocialReducer from "../feature/companySocial/companySocialSlice";
import resumeReducer from "../feature/resume/resumeSlice";

const store = configureStore({
  reducer: {
    auths: authReducer,
    jobs: jobReducer,
    jobTypes: jobTypeReducer,
    jobCategories: jobCategoriesReducer,
    companies: companyReducer,
    candidateProfile: candidateProfileReducer,
    companySocials: companySocialReducer,
    resumes: resumeReducer
  }
});

export default store;