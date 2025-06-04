'use client'

import { motion } from 'framer-motion'
import { FiGithub, FiExternalLink, FiFilter } from 'react-icons/fi'
import useSoundPlayer from '@/hooks/useSoundPlayer'
import { useEffect, useState } from 'react'
import Image from 'next/image'

type Project = {
  id: number
  title: string
  description: string
  tags: string[]
  github?: string
  live?: string
  image?: string
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Portfolio Website',
    description: 'The very site you\'re viewing now! Built with Next.js, Framer Motion, and Tailwind CSS.',
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Framer Motion'],
    github: 'https://github.com/yourusername/portfolio',
    live: '#',
    image: '/project-images/portfolio.jpg'
  },
  {
    id: 2,
    title: 'E-Commerce App',
    description: 'Full-featured online store with cart functionality and payment processing.',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com/yourusername/ecommerce',
    live: 'https://ecommerce-demo.com',
    image: '/project-images/ecommerce.jpg'
  },
  {
    id: 3,
    title: 'Task Manager',
    description: 'Productivity app with drag-and-drop task organization and real-time sync.',
    tags: ['React', 'Firebase', 'DnD Kit'],
    github: 'https://github.com/yourusername/task-manager',
    live: 'https://tasks-demo.com',
    image: '/project-images/taskmanager.jpg'
  },
  {
    id: 4,
    title: 'Weather Dashboard',
    description: 'Real-time weather forecasts with animated weather representations.',
    tags: ['JavaScript', 'API', 'CSS'],
    github: 'https://github.com/yourusername/weather-app',
    live: 'https://weather-demo.com',
    image: '/project-images/weather.jpg'
  }
]

const TAG_COLORS: Record<string, string> = {
  'Next.js': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'TypeScript': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  'React': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  'Node.js': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Tailwind': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  'Firebase': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  'API': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'CSS': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  'MongoDB': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  'Stripe': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  'Framer Motion': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
  'DnD Kit': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
}

export default function ProjectsPage() {
  const { playClick , playPageChange} = useSoundPlayer()
  const [filter, setFilter] = useState<string>('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
    useEffect(() => {
    playPageChange();  
  }, [playPageChange]);
  const allTags = Array.from(new Set(PROJECTS.flatMap(project => project.tags)))
  const filteredProjects = filter === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(project => project.tags.includes(filter))

  return (
    <div className="min-h-screen py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500">
          My Projects
        </h1>
        
        {/* Filter Controls */}
        <div className="mb-12 flex flex-col items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            onTapStart={() => playClick()}
            className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4"
          >
            <FiFilter className="mr-2" />
            Filter: {filter}
          </motion.button>
          
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap justify-center gap-2 max-w-2xl"
            >
              <button
                onClick={() => {
                  setFilter('All')
                  playClick()
                }}
                className={`px-4 py-2 rounded-full ${filter === 'All' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700'}`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setFilter(tag)
                    playClick()
                  }}
                  className={`px-4 py-2 rounded-full ${filter === tag 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : TAG_COLORS[tag] || 'bg-gray-100 dark:bg-gray-700'}`}
                >
                  {tag}
                </button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              
                <div className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Project Image */}
                  <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                        {project.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map(tag => (
                        <span 
                          key={tag}
                          className={`px-3 py-1 rounded-full text-sm ${TAG_COLORS[tag] || 'bg-gray-100 dark:bg-gray-700'}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Links */}
                    <div className="flex space-x-4">
                      {project.github && (
                        <motion.a
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onTapStart={() => playClick()}
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FiGithub className="mr-2" /> Code
                        </motion.a>
                      )}
                      {project.live && (
                        <motion.a
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onTapStart={() => playClick()}
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <FiExternalLink className="mr-2" /> Live Demo
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}