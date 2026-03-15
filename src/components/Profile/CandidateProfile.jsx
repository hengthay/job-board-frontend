import React from 'react'

const CandidateProfile = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
      <img src={`${import.meta.env.VITE_API_URL}/storage/${data.profile_image}`} alt="profile" className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-sm" />
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-800">{data.user?.name}</h1>
        <p className="text-lg text-gray-600 font-medium">{data.title}</p>
        <p className="text-sm text-gray-500">Experience: {data.experience_years} years</p>
        
        <div className="flex gap-3 mt-4">
          {data.github_url && <a href={data.github_url} className="px-3 py-1 bg-gray-800 text-white rounded-md text-sm">GitHub</a>}
          {data.linkedin_url && <a href={data.linkedin_url} className="px-3 py-1 bg-blue-700 text-white rounded-md text-sm">LinkedIn</a>}
          {data.portfolio_url && <a href={data.portfolio_url} className="px-3 py-1 bg-green-600 text-white rounded-md text-sm">Portfolio</a>}
        </div>
      </div>
    </div>
    <div className="mt-8">
      <h3 className="text-xl font-semibold border-b pb-2">Professional Summary</h3>
      <p className="mt-3 text-gray-700 leading-relaxed">{data.summary}</p>
    </div>
  </div>
  )
}

export default CandidateProfile