import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany, selectCompanyData, selectCompanyStatus } from '../feature/company/companySlice';
import { selectUser } from '../feature/auth/authSlice';
import { fetchCandidateProfile, selectCandidateProfileData, selectCandidateProfileStatus } from '../feature/candidateProfile/candidateProfileSlice';
import { Link } from 'react-router-dom';
import EmployerProfile from '../components/Company/EmployerProfile';
import CandidateProfile from '../components/Profile/CandidateProfile';

const Profile = () => {
  
  // Get user role
  const user = useSelector(selectUser);
  // console.log(user.role);
  const role = user?.user?.role;

  // Get Companies data
  const companies = useSelector(selectCompanyData);
  const companyStatus = useSelector(selectCompanyStatus);

  // Get Candidate Profile data
  const candidateProfile = useSelector(selectCandidateProfileData);
  const candidateProfileStatus = useSelector(selectCandidateProfileStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (role === 'employer' && companyStatus === 'idle') {
      dispatch(fetchCompany())
    } else if(role === 'user' && candidateProfileStatus === 'idle') {
      dispatch(fetchCandidateProfile())
    }
  }, [companyStatus, candidateProfileStatus, role, dispatch]);

  // console.log(companies);
  // console.log(candidateProfile);

  const profileData = role === 'employer' ? companies : candidateProfile;
  const hasProfile = profileData && Object.keys(profileData).length > 0;
  const isLoading = (role === 'employer' && (companyStatus === 'loading' || companyStatus === 'idle')) || (role === 'user' && (candidateProfileStatus === 'loading' || candidateProfileStatus === 'idle'));
  // console.log(profileData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center gap-x-1.5 min-h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {
        hasProfile ? (
          role === 'employer' ? <EmployerProfile data={profileData}/> : <CandidateProfile data={profileData} />
        ) : (
          <div className="text-center space-y-4 p-10 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">You haven't set up your profile yet.</p>
            {
              role === 'employer' ? (
                <Link
                  to={'/companies/create'}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md"
                  >
                  Create Company Profile
                </Link>
              ) : (
              <Link
                to={'/profiles/create'}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md"
                >
                Create Profile
              </Link>)
            }
          </div>
        )
      }
    </div>
  );
};

export default Profile;