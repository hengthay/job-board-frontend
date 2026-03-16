import { useEffect, useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchCompanyById, resetCompanyStatus, selectCompanyDetailData, updateCompanyProfile } from "../../feature/company/companySlice";
import Swal from "sweetalert2";

const CompanyUpdate = () => {

  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo_path: null,
    website_url: "",
    industry: "",
    company_size: "",
    location: "",
    description: "",
    verified_at: "",
  });
  
  const { id } = useParams();
  // console.log('companies id ', id);
  const companyDetail = useSelector(selectCompanyDetailData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // Fetch companies data
  useEffect(() => {
    try {
      if(id) dispatch(fetchCompanyById(id));
    } catch (error) {
      console.log(error);
    }
  }, [id, dispatch]);

  // When redux is ready
  useEffect(() => {
    try {
      if(!companyDetail) return;

      setForm({
        name: companyDetail?.name ?? "",
        slug: companyDetail?.slug ?? "",
        logo_path: null,
        website_url: companyDetail?.website_url ?? "",
        industry: companyDetail?.industry ?? "",
        company_size: companyDetail?.company_size ?? "",
        location: companyDetail?.location ?? "",
        description: companyDetail?.description ?? "",
      });

      setCurrentImage(companyDetail?.logo_path || null);
      setImagePreview(null);
    } catch (error) {
      console.log(error);
    }
  }, [companyDetail]);

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "logo_path") {
      const file = files?.[0];
      setForm((prev) => ({
        ...prev,
        logo_path: file || null,
      }));
      if (file) setImagePreview(URL.createObjectURL(file));
      return;
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if(!form.name || !form.industry) {
        setIsError("Field Company-name and Industry are required!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('slug', form.slug);
      formData.append('website_url', form.website_url);
      formData.append('industry', form.industry);
      formData.append('company_size', form.company_size);
      formData.append('location', form.location);
      formData.append('description', form.description);

      if(form.logo_path) {
        formData.append('logo_path', form.logo_path);
      }

      const result = await dispatch(updateCompanyProfile({ id, formData })).unwrap();

      if(updateCompanyProfile.fulfilled.match(result)) {
        dispatch(resetCompanyStatus());
      }

      Swal.fire({
        title: "Success",
        text: "Company Profile is updated successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/profiles');
      }, 2000);

      // Clear form
      setForm({
        name: "",
        slug: "",
        logo_path: null,
        website_url: "",
        industry: "",
        company_size: "",
        location: "",
        description: "",
        verified_at: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Company Profile is failed to update - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };
  // console.log('company detail - ', companyDetail)
  // console.log('formData - ', form);
  // console.log('imagePreview - ', imagePreview);
  // console.log('currentImage - ', currentImage);

  const displayedImage = imagePreview || (currentImage ? `${import.meta.env.VITE_API_URL}/storage/${currentImage}` : null);

  return (
    <div className="mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10">
      <div className="w-full flex flex-col items-start">
        <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
          Let's update your profile.
        </h2>
        <div className="w-full my-4">
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className="space-y-4">
              <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-x-6">
                <div className="md:col-span-2 col-span-1 space-y-3">
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Company Name
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Smart Axiata Co. Ltd,."
                      value={form.name}
                      onChange={handleOnChange}
                    />
                    {/* Optional: Small helper text helps with UX */}
                    <p className="text-xs text-gray-500">
                      Try to be specific (e.g., "Your Company Name Co. Ltd,."
                      instead of just "Company Name").
                    </p>
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="location"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Location
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="location"
                      name="location"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Head Quarter, etc."
                      value={form.location}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="industry"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Industry
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="industry"
                      name="industry"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Telecomminucation, etc."
                      value={form.industry}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="website_url"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Website URL
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. https://your-company-domain.com"
                      value={form.website_url}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="description"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Description
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      cols={5}
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Describe about your company here..."
                      value={form.description}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className="col-span-1 md:mt-7 mt-6 space-y-3">
                  <div className="w-full h-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                    {displayedImage ? (
                      <img
                        src={displayedImage}
                        alt="preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="space-y-2 flex flex-col">
                        <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                          No image selected
                        </span>
                        <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                          Accept type: JPG, PNG, JPEG, SVG
                        </span>
                        <span className="sm:text-sm text-xs text-gray-400 text-center px-2">
                          File Size should be less than 2 MB.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload */}
                  <p className="flex justify-end items-end w-full mt-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition">
                      <FiUpload />
                      Upload image
                      <input
                        type="file"
                        name="logo_path"
                        accept="image/*"
                        onChange={handleOnChange}
                        className="hidden"
                      />
                    </label>
                  </p>

                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="company_size"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Company Size
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <select
                      id="company_size"
                      name="company_size"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400"
                      placeholder="e.g. https://your-company-domain.com"
                      value={form.company_size}
                      onChange={handleOnChange}
                    >
                      <option value="" defaultChecked disabled>
                        Choose a size
                      </option>
                      <option value="Large">Large</option>
                      <option value="Large">Enterprise</option>
                      <option value="Medium">Medium</option>
                      <option value="Small">Small</option>
                      <option value="Home-Bussiness">Home-Bussiness</option>
                    </select>
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="slug"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Slug
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Your company name in lowercase"
                      value={form.slug}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
              >
                <FiSave />
                Save
              </button>
            </div>
            {isError && <p className="text-base text-red-500">{isError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyUpdate;
