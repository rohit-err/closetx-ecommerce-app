import React from 'react'
import { useState } from 'react'
import useAdminStore from '../store/adminStore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Loader } from "lucide-react"

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { adminLogin, error, isLoading } = useAdminStore()
    const navigate = useNavigate()
    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const res = await adminLogin(email, password)

        } catch (err) {
            console.log(err)
            toast.error(err.response?.data?.message || "Login failed")
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder='your@email.com' required />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="password" placeholder='Enter your password' required />
                    </div>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className={`mt-2 w-full py-2 px-4 rounded-md text-white bg-black flex items-center justify-center
    ${isLoading ? "opacity-80 cursor-not-allowed" : "hover:bg-black/90 transition-colors"}`}
                    >
                        {isLoading ? (
                            <Loader className="animate-spin text-white" size={18} />
                        ) : (
                            "Login"
                        )}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Login