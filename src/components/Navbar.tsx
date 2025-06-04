'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiCode, FiAward, FiMail, FiUser } from 'react-icons/fi'
import useSoundPlayer from '@/hooks/useSoundPlayer'

const links = [
  { name: 'Home', path: '/', icon: <FiHome /> },
  { name: 'Projects', path: '/projects', icon: <FiCode /> },
  { name: 'About', path: '/about', icon: <FiAward /> },
  { name: 'suggestion', path: '/suggestion', icon: <FiMail /> },
  { name: 'Me', path: '/me', icon: <FiUser /> },
]

export default function Navbar() {
    const pathname = usePathname()
    const { playClick} = useSoundPlayer()
  
    return (
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 z-50">
        <ul className="flex space-x-2">
          {links.map((link) => (
            <li key={link.path}>
              <Link href={link.path} title={link.name}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onTapStart={() => { playClick() ;}}
                  className={`p-3 rounded-full flex items-center justify-center ${
                    pathname === link.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span className="sr-only">{link.name}</span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }