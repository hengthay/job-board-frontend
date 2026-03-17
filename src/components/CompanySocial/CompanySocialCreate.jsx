import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createCompanySocial } from '../../feature/companySocial/companySocialSlice';
import { FiSave } from 'react-icons/fi';
import { resetCompanyStatus } from '../../feature/company/companySlice';

const CompanySocialCreate = () => {

  const [form, setForm] = useState({
    platform: "",
    url: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('platform', form.platform);
      formData.append('url', form.url);

      await dispatch(createCompanySocial(formData)).unwrap();

      // Reload Company Data
      dispatch(resetCompanyStatus());

      Swal.fire({
        title: "Success",
        text: "Company Social is created successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/profiles');
      }, 2000);

      // Clear form
      setForm({
        platform: "",
        url: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Company Social is failed to create - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  console.log('formData - ', form);

  return (
    <div className="mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10">
      <div className="w-full flex flex-col items-start">
        <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
          Let's Create Company Social.
        </h2>
        <div className="w-full my-4">
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className="space-y-4">
              <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-x-6">
                <div className="w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label
                    htmlFor="platform"
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Platform Name
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <select
                    id="platform"
                    name="platform"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    value={form.platform}
                    onChange={handleOnChange}
                  >
                    <option value="" defaultChecked disabled>Choose a platform</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Linkedin">Linkedin</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="w-full flex flex-col space-y-2 group">
                  {/* Label with a subtle weight and color */}
                  <label
                    htmlFor="url"
                    className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                  >
                    Platform URL
                  </label>
                  {/* Input with smooth transitions and improved focus states */}
                  <input
                    type="text"
                    id="url"
                    name="url"
                    className="
                      w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                    "
                    placeholder="e.g. https://your-domain.com"
                    value={form.url}
                    onChange={handleOnChange}
                  />
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/profiles"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                <FiSave />
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompanySocialCreate