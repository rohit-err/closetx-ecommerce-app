import React, { useState, useEffect } from 'react'
import useShopStore from '../store/shopStore'
import { toast } from 'react-toastify'
import { Loader } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { userSignIn, isLoading, userSignUp, error, showContactModal, setShowContactModal, showLoginModal, setShowLoginModal, showLoginModal2, setShowLoginModal2, setOpenWishList, showRedDot, setShowRedDot } = useShopStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const validateForm = () => {
    if (currentState === 'Sign Up' && !name.trim()) {
      toast.error("Name is required")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email")
      return false
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return false
    }

    return true
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return

    let res
    if (currentState === 'Login') {
      res = await userSignIn(email, password)
    } else {
      res = await userSignUp(name, email, password)
    }


    if (res?.success) {
      toast.success(res.message || (currentState === 'Login' ? "Logged in successfully" : "Account created successfully"))
      setName('')
      setEmail('')
      setPassword('')

      if (showLoginModal) {
        setShowLoginModal(false)
        setTimeout(() => {
          setShowContactModal(true)
        }, 200)
      }
      if (showLoginModal2) {
        setShowLoginModal2(false)
        navigate('/interest')
        if (showRedDot) {
          setShowRedDot(false)
        }
        setOpenWishList(false)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800 " />
      </div>

      {currentState !== 'Login' && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        {currentState === 'Login' && (
          <p className="cursor-pointer">Forgot your password?</p>
        )}
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer">Create Account</p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer">Login Here</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin text-white h-5 w-5" />
        ) : (
          currentState === 'Login' ? 'Sign In' : 'Sign Up'
        )}
      </button>
    </form>
  )
}

export default Login
