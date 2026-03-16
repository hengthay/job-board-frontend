import { useEffect, useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchIndividualCandidateProfile, resetCandidateProfileDetail, selectCandidateProfileDetailData, updateCandidateProfile } from "../../feature/candidateProfile/candidateProfileSlice";
const ProfileUpdate = () => {

  const [form, setForm] = useState({
    title: "",
    profile_image: null,
    summary: "",
    location: "",
    experience_years: 0,
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
  });

  const { id } = useParams();
  // console.log(id);
  const profileDetail = useSelector(selectCandidateProfileDetailData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState("")
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  // Fetch individual profile
  useEffect(() => {
    try {
      if(id) dispatch(fetchIndividualCandidateProfile(id));

      return () => {
        dispatch(resetCandidateProfileDetail());
      };
    } catch (error) {
      console.log(error);
    }
  }, [id, dispatch]);

  console.log('profileDetail', profileDetail);

  // When Redux is ready
  useEffect(() => {
    try {

      if (!profileDetail) return;

      setForm({
        title: profileDetail?.title ?? "",
        profile_image: null,
        summary: profileDetail?.summary ?? "",
        location: profileDetail?.location ?? "",
        experience_years: profileDetail?.experience_years ?? 0,
        portfolio_url: profileDetail?.portfolio_url ?? "",
        linkedin_url: profileDetail?.linkedin_url ?? "",
        github_url: profileDetail?.github_url ?? "",
      });

      setCurrentImage(profileDetail?.profile_image || null);
      setImagePreview(null);
    } catch (error) {
      console.log(error);
    }
  }, [profileDetail])

  const handleOnChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_image") {
      const file = files?.[0];
      setForm((prev) => ({
        ...prev,
        profile_image: file || null,
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

      if(!form.title) {
        setIsError("Job Position is required!");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('experience_years', form.experience_years);
      formData.append('portfolio_url', form.portfolio_url);
      formData.append('linkedin_url', form.linkedin_url);
      formData.append('github_url', form.github_url);
      formData.append('location', form.location);
      formData.append('summary', form.summary);

      if(form.profile_image) {
        formData.append('profile_image', form.profile_image);
      }

      const result = await dispatch(updateCandidateProfile({ id, formData })).unwrap();

      if(updateCandidateProfile.fulfilled.match(result)) {
        dispatch(resetCandidateProfileDetail());
      }

      Swal.fire({
        title: "Success",
        text: "Profile is updated successfully!",
        icon: "success",
        timer: 2000,
      });

      const timeOut = setTimeout(() => {
        navigate('/profiles');
      }, 2000);

      // Clear form
      setForm({
        title: "",
        profile_image: null,
        summary: "",
        location: "",
        experience_years: 0,
        portfolio_url: "",
        linkedin_url: "",
        github_url: "",
      });

      return () => clearTimeout(timeOut);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Failed",
        text: `Profile is failed to update - ${error}`,
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // console.log('formData - ', form);
  const displayedImage = imagePreview || (currentImage ? `${import.meta.env.VITE_API_URL}/storage/${currentImage}` : null);
  
  return (
    <div className="mt-10 md:px-20 px-6 max-w-7xl h-auto shadow-md border border-gray-200 md:mx-auto mx-4 rounded-xl py-4 my-10">
      <div className="w-full flex flex-col items-start">
        <h2 className="md:text-3xl text-2xl font-medium tracking-wide">
          Let's Update your profile.
        </h2>
        <div className="w-full my-4">
          <form action="w-full" onSubmit={handleOnSubmit}>
            <div className="space-y-4">
              <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-x-6">
                <div className="md:col-span-2 col-span-1 space-y-3">
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="title"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Your Position
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Senior Backend Developer"
                      value={form.title}
                      onChange={handleOnChange}
                    />
                    {/* Optional: Small helper text helps with UX */}
                    <p className="text-xs text-gray-500">
                      Try to be specific (e.g., "Senior Backend Developer").
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
                      placeholder="e.g. Phnom Penh, Cambodia etc."
                      value={form.location}
                      onChange={handleOnChange}
                    />
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="experience_years"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Experience Year
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="number"
                      id="experience_years"
                      name="experience_years"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. 1 nor 2"
                      value={form.experience_years}
                      onChange={handleOnChange}
                    />
                    {/* Optional: Small helper text helps with UX */}
                    <p className="text-xs text-gray-500">
                      It can be optional, if you haven't get any experience before.
                    </p>
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="github_url"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Github URL
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="github_url"
                      name="github_url"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. https://your-domain.com"
                      value={form.github_url}
                      onChange={handleOnChange}
                    />
                    <p className="text-xs text-gray-500">
                      It can be optional, if you doesn't have it.
                    </p>
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="summary"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Summary 
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <textarea
                      id="summary"
                      name="summary"
                      rows={4}
                      cols={5}
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. Describe about yourself here..."
                      value={form.summary}
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
                        name="profile_image"
                        accept="image/*"
                        onChange={handleOnChange}
                        className="hidden"
                      />
                    </label>
                  </p>

                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="portfolio_url"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Portfolio URL
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="portfolio_url"
                      name="portfolio_url"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. https://your-domain.com"
                      value={form.portfolio_url}
                      onChange={handleOnChange}
                    />
                    <p className="text-xs text-gray-500">
                      It can be optional, if you doesn't have it.
                    </p>
                  </div>
                  <div className="w-full flex flex-col space-y-2 group">
                    {/* Label with a subtle weight and color */}
                    <label
                      htmlFor="linkedin_url"
                      className="text-sm font-semibold text-gray-700 group-focus-within:text-cyan-600 transition-colors"
                    >
                      Linkedin URL
                    </label>
                    {/* Input with smooth transitions and improved focus states */}
                    <input
                      type="text"
                      id="linkedin_url"
                      name="linkedin_url"
                      className="
                            w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 hover:border-gray-400
                          "
                      placeholder="e.g. https://your-domain.com"
                      value={form.linkedin_url}
                      onChange={handleOnChange}
                    />
                    <p className="text-xs text-gray-500">
                      It can be optional, if you doesn't have it.
                    </p>
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
  )
}

export default ProfileUpdate