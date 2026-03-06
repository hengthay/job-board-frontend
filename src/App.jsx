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

const App = () => { 
  return ( 
    <Routes> 
      {/* Public Route */} 
      <Route path='/' element={<Job />} index/> 
      {/* Protected Route */} 
      <Route element={<ProtectedRoute />}> 
        <Route element={<MainLayout />}> 
          <Route path='/applications' element={<Application />}/> 
          <Route path='/companies' element={<Company />}/> 
          <Route path='/profiles' element={<Profile />}/> 
          <Route path='/resumes' element={<Resume />}/> 
        </Route> 
      </Route> 
      <Route path='/login' element={<Login />}/> 
      {/* === 404 Fallback === */} 
      <Route path="*" element={<NotFound />} /> 
    </Routes> 
  )
}

export default App
