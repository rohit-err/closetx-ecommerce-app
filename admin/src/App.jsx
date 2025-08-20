
import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import useAdminStore from './store/adminStore'
import Login from './pages/Login'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FullScreenLoader } from './components/ui/LoadingSpinner'
import ViewProduct from './pages/ViewProduct'
import './App.css'
const App = () => {
  const {
    admin,
    isAuthenticated,
    error,
    isCheckingAuth,
    checkAuth
  } = useAdminStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <FullScreenLoader message="Checking authentication..." />

  return (
    <div className="min-h-screen">
      <ToastContainer />
      {isAuthenticated ? (
        <div className="flex flex-col h-screen">

          <div className="fixed top-0 left-0 right-0 z-30 bg-white border-b">
            <Navbar />
          </div>

          <div className="flex flex-1 pt-16">

            <div className="fixed left-0 top-16 bottom-0 z-20 bg-white">
              <Sidebar />
            </div>

            <div className="flex-1 ml-[18%] overflow-y-auto">
              <div className="p-6 max-w-6xl mx-auto">
                <Routes>

                  <Route path='/add' element={<Add />} />
                  <Route path='/list' element={<List />} />
                  <Route path='/product/:id' element={< ViewProduct />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  )
}

export default App
