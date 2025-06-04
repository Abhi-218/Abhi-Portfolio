'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import useSoundPlayer from '@/hooks/useSoundPlayer'

interface UserData {
  id: string
  name: string
  email: string
  role: string
  profileImage: string
  isVerified: boolean
}

export default function Profile() {
  const { playPageChange } = useSoundPlayer()
  
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)

  // Play sound effect when page loads
  useEffect(() => {
    playPageChange()
  }, [playPageChange])

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("hello")
        const response = await fetch('/api/auth/me')
        const data = await response.json()
        console.log("response" , response)
        console.log("data" , data)
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user data')
        }

        if (data.success) {
          setUserData(data.user)
        }
      } catch (error: unknown) {
        if(error instanceof Error){
          setErrorMessage(error.message || 'Something went wrong. Please try again.')
        }
        else{
          setErrorMessage('Something went wrong. Please try again.')

        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])


  const handleLogout = async ()=>{
         const response = await fetch('/api/auth/logout', {
      method: 'POST', // ✅ required
    })
    const data = await response.json();
    console.log('Response:', data);

    if (response.ok) {
      window.location.href = '/login';
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="opacity-90">Account Information</p>
        </div>

        <div className="p-6 md:p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your profile...</p>
            </div>
          ) : errorMessage ? (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
              <p>{errorMessage}</p>
              <div className="mt-4">
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Return to login
                </Link>
              </div>
            </div>
          ) : userData ? (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md">
                  <Image 
                    src={userData.profileImage || '/api/placeholder/200/200'} 
                    alt="Profile picture" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <div className="mt-1 flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${userData.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {userData.isVerified ? 'Verified Account' : 'Pending Verification'}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-4 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                  <p className="text-gray-900 dark:text-gray-100">{userData.email}</p>
                </div>
                
                <div className="border-b pb-4 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Type</p>
                  <div className="flex items-center">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="border-b pb-4 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account ID</p>
                  <p className="text-gray-900 dark:text-gray-100 text-sm font-mono">{userData.id}</p>
                </div>
              </div>

              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 text-white font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-all"
                >
                  Edit Profile
                </motion.button>
                
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full mt-4 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                  >
                    Logout
                  </motion.button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">No user data found.</p>
              <div className="mt-4">
                <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Return to login
                </Link>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}