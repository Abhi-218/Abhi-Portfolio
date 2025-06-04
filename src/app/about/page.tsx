'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import useSoundPlayer from "@/hooks/useSoundPlayer";
import { useEffect } from 'react';

export default function About() {
    const { playPageChange , playClick } = useSoundPlayer(); 
  
    useEffect(() => {
    playPageChange();  
  }, [playPageChange]);

  const education = [
    {
      degree: "Master of Computer Science",
      institution: "Tech University",
      period: "2015 - 2017",
      description: "Specialized in Human-Computer Interaction and Web Technologies."
    },
    {
      degree: "Bachelor of Science in Information Technology",
      institution: "State University",
      period: "2011 - 2015",
      description: "Graduated with honors. Focus on software development and web design."
    }
  ];

  const devOpsSkills = [
    { name: "Docker", level: 90 },
    { name: "Kubernetes", level: 85 },
    { name: "CI/CD", level: 88 },
    { name: "AWS", level: 82 },
    { name: "Terraform", level: 75 },
    { name: "Jenkins", level: 80 }
  ];

  const softwareDevSkills = [
    { name: "JavaScript", level: 95 },
    { name: "React", level: 92 },
    { name: "Next.js", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "TypeScript", level: 88 },
    { name: "Tailwind CSS", level: 93 }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-6 relative">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">About Me</span>
            <span className="absolute -bottom-1 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
          </h1>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
            <div className="w-64 h-64 relative group">
              <div className="absolute inset-0 rounded-xl overflow-hidden rotate-3 transition-transform group-hover:rotate-0 duration-300">
                <Image
                  src="https://res.cloudinary.com/dlktmd2qd/image/upload/v1746715618/abhishekportfolio/bq5yfiwrbhvimi7isr4s.png"
                  alt="Developer portrait"
                  fill
                  className="object-cover"
                />  
              </div>
              <div className="absolute inset-0 border-4 border-primary rounded-xl transform rotate-3 group-hover:rotate-0 transition-transform duration-300"></div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Abhishek Vekariya</h2>
              <h3 className="text-xl text-primary mb-4">DevOps Engineer & Software Developer</h3>
              
              <p className="mb-4 text-slate-700 dark:text-slate-300">
                I&apos;m a passionate full-stack developer with 8+ years of experience creating beautiful, 
                functional, and user-centered digital experiences. I specialize in building modern 
                web applications using Next.js, React, and Tailwind CSS, while also implementing robust DevOps practices.
              </p>
              
              <p className="mb-6 text-slate-700 dark:text-slate-300">
                My approach combines clean code practices, CI/CD automation, infrastructure as code, and thoughtful 
                cloud architecture to create scalable, maintainable applications. I&apos;m dedicated to continuous learning 
                and staying at the forefront of both development and operations technologies.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                <div>
                  <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Location</h4>
                  <p className="text-slate-600 dark:text-slate-400">Punagam, Surat, India</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Email</h4>
                  <p className="text-slate-600 dark:text-slate-400">abhivekariya218@gmail.com</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Phone</h4>
                  <p className="text-slate-600 dark:text-slate-400">(+91) 9328316571</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-200">Available for</h4>
                  <p className="text-slate-600 dark:text-slate-400">Freelance & Full-time</p>
                </div>
              </div>
              
              <Link 
                href="/next.svg"
                download={true}
                onClick={() => playClick()}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Resume
              </Link>
            </div>
          </div>
          
          {/* Skills Section */}
          <motion.div 
            className="mb-16"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold mb-8 relative">
              <span className="relative z-10">My Skills</span>
              <span className="absolute -bottom-1 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* DevOps Skills */}
              <motion.div
                variants={itemVariants}
                className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm shadow-md"
              >
                <h3 className="text-xl font-bold mb-4 text-blue-600 dark:text-blue-400">DevOps</h3>
                <div className="space-y-4">
                  {devOpsSkills.map((skill, index) => (
                    <motion.div 
                      key={index}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              {/* Software Development Skills */}
              <motion.div
                variants={itemVariants}
                className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm shadow-md"
              >
                <h3 className="text-xl font-bold mb-4 text-purple-600 dark:text-purple-400">Software Development</h3>
                <div className="space-y-4">
                  {softwareDevSkills.map((skill, index) => (
                    <motion.div 
                      key={index}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column for experience (kept empty as in original) */}
            {/* Project Experience */}
<motion.div
  initial="hidden"
  animate="visible"
  transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
  className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-md"
>
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold relative">
      <span>Experience</span>
      <span className="absolute -bottom-1 left-0 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
    </h2>
  </div>
  
  <div className="space-y-6">
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-slate-700 dark:text-slate-300 leading-relaxed"
    >
      While I don&apos;t have traditional company experience yet, I&apos;ve focused on building a strong portfolio of 
      <span className="text-primary font-medium"> hands-on projects </span> 
      that demonstrate my skills as a developer and DevOps engineer.
    </motion.p>
    
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6"
    >
      <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-200">Real-time Chat Website</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Built with React, Socket.io and Node.js</p>
      </div>
      
      <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-200">Portfolio Website</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Crafted with Next.js and Tailwind CSS</p>
      </div>
      
      <div className="bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg backdrop-blur-sm flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 dark:text-gray-200">Freelancer Platform</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Developed with MERN stack and AWS</p>
      </div>
    </motion.div>
    
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-6 flex justify-center"
    >
      <Link 
        href="/projects"
        onClick={() => playClick()}
        className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
      >
        <span>View All Projects</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </motion.div>
  </div>
</motion.div>
            
            {/* Education section */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1, delayChildren: 0.5 }}
              className="bg-white/30 dark:bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm shadow-md"
            >
              <div className="flex items-center mb-8">
                <h2 className="text-2xl font-bold relative">
                  <span>Education</span>
                  <span className="absolute -bottom-1 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></span>
                </h2>
              </div>
              
              <div className="space-y-8">
                {education.map((edu, index) => (
                  <motion.div 
                    key={index}
                    variants={itemVariants}
                    transition={{ duration: 0.5 }}
                    className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-700"
                  >
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-slate-500 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full">{edu.period}</span>
                    </div>
                    <h3 className="text-xl font-bold">{edu.degree}</h3>
                    <p className="text-primary mb-2">{edu.institution}</p>
                    <p className="text-slate-600 dark:text-slate-400">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}