import React from 'react'
import Job from './pages/Job'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import Company from './pages/Company'
import Application from './pages/Application'
import Profile from './pages/Profile'
import Resume from './pages/Resume'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import Home from './pages/Home'
import JobCreate from './components/Job/JobCreate'
import JobUpdate from './components/Job/JobUpdate'
import JobDetail from './components/Job/JobDetail'
import CompanyCreate from './components/Company/CompanyCreate'
import CompanyUpdate from './components/Company/CompanyUpdate'
import ProfileCreate from './components/Profile/ProfileCreate'
import ProfileUpdate from './components/Profile/ProfileUpdate'
import CompanySocialCreate from './components/CompanySocial/CompanySocialCreate'
import CompanySocialUpdate from './components/CompanySocial/CompanySocialUpdate'
import ResumeCreate from './components/Resume/ResumeCreate'
import ResumeUpdate from './components/Resume/ResumeUpdate'

const App = () => { 
  return ( 
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Route */}
        <Route path='/' element={<Home />} index /> 
        {/* Protected Route */}
        <Route path='/jobs/:id/view' element={<JobDetail />}/> 
        <Route element={<ProtectedRoute />}> 
            <Route path='/applications' element={<Application />}/> 
            <Route path='/companies' element={<Company />}/> 
            <Route path='/companies/create' element={<CompanyCreate />}/> 
            <Route path='/companies/:id/edit' element={<CompanyUpdate />}/> 
            <Route path='/company-socials/create' element={<CompanySocialCreate />}/> 
            <Route path='/company-socials/:id/edit' element={<CompanySocialUpdate />}/> 
            <Route path='/profiles' element={<Profile />}/> 
            <Route path='/profiles/create' element={<ProfileCreate />}/> 
            <Route path='/profiles/:id/edit' element={<ProfileUpdate />}/> 
            <Route path='/resumes' element={<Resume />}/> 
            <Route path='/resumes/create' element={<ResumeCreate />}/> 
            <Route path='/resumes/:id/edit' element={<ResumeUpdate />}/> 
            <Route path='/my-jobs' element={<Job />}/> 
            <Route path='/jobs/create' element={<JobCreate />}/> 
            <Route path='/jobs/:id/edit' element={<JobUpdate />}/> 
        </Route> 
      </Route> 
      <Route path='/login' element={<Login />}/> 
      <Route path='/register' element={<Register />}/> 
      {/* === 404 Fallback === */} 
      <Route path="*" element={<NotFound />} /> 
    </Routes> 
  )
}

export default App
