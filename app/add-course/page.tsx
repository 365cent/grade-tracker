"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { localStorage } from "@/utils/localStorage"
import { motion } from "framer-motion"

export default function AddCourse() {
  const router = useRouter()
  const [course, setCourse] = useState({
    name: "",
    code: "",
    term: "",
    endDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.addCourse(course)
    router.push("/")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-screen-md"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent"
      >
        Add New Course
      </motion.h1>
      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg shadow-lg"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Label htmlFor="name" className="text-gray-700">Course Name</Label>
          <Input
            id="name"
            value={course.name}
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
            required
            className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Label htmlFor="code" className="text-gray-700">Course Code</Label>
          <Input
            id="code"
            value={course.code}
            onChange={(e) => setCourse({ ...course, code: e.target.value })}
            required
            className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Label htmlFor="term" className="text-gray-700">Term</Label>
          <Input
            id="term"
            value={course.term}
            onChange={(e) => setCourse({ ...course, term: e.target.value })}
            required
            className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
          />
        </motion.div>
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Label htmlFor="endDate" className="text-gray-700">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={course.endDate}
            onChange={(e) => setCourse({ ...course, endDate: e.target.value })}
            required
            className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
          />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button 
            type="submit"
            className="w-full bg-black hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl text-lg py-6"
          >
            Add Course
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  )
}
