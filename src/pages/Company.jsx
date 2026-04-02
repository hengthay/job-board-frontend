import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { fetchAllCompanies, selectAllCompaniesData, selectCompaniesStatus, selectCompanyError } from '../feature/company/companySlice';
import CompanyCard from '../components/Admin/Company/CompanyCard';

const Company = () => {

  const { sideBarOpen } = useOutletContext();
  // Action
  const dispatch = useDispatch();
  const companies = useSelector(selectAllCompaniesData);
  const companiesStatus = useSelector(selectCompaniesStatus);
  const companiesError = useSelector(selectCompanyError);

  useEffect(() => {
    try {
      
      if(companiesStatus === 'idle') dispatch(fetchAllCompanies());

    } catch (error) {
      console.log(error);
    }
  }, [dispatch, companiesStatus])
  
  console.log('All Companies - ', companies);
  return (
    <div
      className={`w-full transition-all ease-in-out duration-300 ${sideBarOpen ? "pl-70" : "pl-0"}`}
      >
      <div className={`${sideBarOpen ? "md:pr-4" : "md:px-8 px-3"}`}>
        <div className="w-full mx-auto border border-gray-300 shadow-sm rounded-sm">
          <div className="md:p-6 p-4 space-y-3">
            <div className="w-full flex flex-col justify-start items-start space-y-2">
              <h1 className="md:text-3xl text-2xl font-medium tracking-wide">
                Compaines
              </h1>
              <p className="md:text-base text-sm text-gray-500 tracking-wide leading-relaxed">
                Tracking overview of all compaines.
              </p>
            </div>
            
            {/* Main card section of Company */}
            <div className='w-full flex flex-col items-center justify-start gap-y-6'>
              {
                companies.length > 0 && (
                  companies.map((company) => (
                    <CompanyCard company={company} key={company.id}/>
                  ))
                )
              }
            </div>
            {
              companiesStatus === 'loading' && (
                <div className="flex items-center mt-6 gap-x-2 py-1.5 my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  <p className="text-black font-medium">Loading<span className="animate-pulse">...</span></p>
                </div>
              )
            }
            {
              companiesStatus === 'failed' && (
                <div className="bg-red-400 py-1.5 px-3 rounded-md my-8">
                  <p className="text-white">Failed to load jobs data, {companiesError}</p>
              </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Company