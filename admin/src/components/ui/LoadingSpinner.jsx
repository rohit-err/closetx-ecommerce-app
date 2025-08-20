
import React from 'react'

const LoadingSpinner = ({ size = 'md', color = 'black' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const colorClasses = {
    black: 'border-black/80',
    white: 'border-white',
    gray: 'border-gray-400',
    blue: 'border-blue-500'
  }

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        border-[3px] 
        ${colorClasses[color]} 
        border-t-transparent 
        rounded-full 
        animate-spin
      `}
    />
  )
}

const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="xl" color="black" />
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

const ButtonSpinner = () => {
  return <LoadingSpinner size="sm" color="white" />
}

export default LoadingSpinner
export { FullScreenLoader, ButtonSpinner }
