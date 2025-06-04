'use client'

import SuggestionList from '@/components/SuggestionList';

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ConfettiExplosion from '@/components/ConfettiExplosion'
import useSoundPlayer from '@/hooks/useSoundPlayer'
import { useRouter } from 'next/navigation';
import { ISuggestion, IUserWithSuccess } from '@/Models/interfaces';


export default function Suggestion() {
  const router = useRouter();
  const [user,setUser] = useState<IUserWithSuccess| undefined>();
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { playClick,playPageChange} = useSoundPlayer()
     
 useEffect(() => {
  playPageChange();  
}, [playPageChange])
 useEffect(() => {
    const loadUserSuggestion = async () => {
      try {
        const res = await fetch('/api/suggestions');
        const suggestions = await res.json();
        const userRes = await fetch('/api/auth/me');
        const user = await userRes.json();
        setUser(user);
        const mine = suggestions.find((s:ISuggestion) => s.user._id === user.user?.id);
        if (mine) {
          setMessage(mine.message);
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Failed to load user suggestion:', error);
      }
    };
        
    loadUserSuggestion();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    playClick()

    try {
       if(!user?.success){
        router.push('/login');
        return;
       }

      const method = isEditing ? 'PUT' : 'POST';
      const url = '/api/suggestions';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Failed to save suggestion');
      }
      if (!isEditing) {
        setIsEditing(true);
      }
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error saving suggestion:', error);
    }
    setIsLoading(false)
    
    // Reset submission status after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className='pb-20'>
    <div className="pt-20 pb-10 px-4 relative overflow-hidden">
      <ConfettiExplosion trigger={isSubmitted} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Suggestion Box</h1>
          <p className="opacity-90">I&apos; d love to hear from you</p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Message {isEditing ? 'Update !' : 'Sent!'}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thanks for giving Suggestion. I will try your Suggestion if posible 😊
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              Update Message
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            
            <div className="mb-8">
              <label htmlFor="message" className="block mb-2 font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full py-4 text-white font-bold rounded-lg transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                isEditing ? 'Update Message' : 'Sent Message'
              )}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
    <SuggestionList/>
    </div>
  )
}
