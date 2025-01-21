"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { localStorage, type Course, type Coursework } from "@/utils/localStorage"
import { seedCourses } from "./seed-data"
import { motion } from "framer-motion"

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([])
  const [coursework, setCoursework] = useState<Coursework[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    seedCourses()
    const existingCourses = localStorage.getCourses()
    setCourses(existingCourses)
    setCoursework(localStorage.getCoursework())
    setIsLoaded(true)
  }, [])

  const calculateCourseProgress = (courseId: string) => {
    const courseWork = coursework.filter(cw => cw.courseId === courseId)
    let courseScore = 0
    let totalPercentage = 0
    
    courseWork.forEach(cw => {
      if (cw.grade !== undefined) {
        courseScore += (cw.grade * cw.percentage) / 100
        totalPercentage += cw.percentage
      }
    })
    
    return {
      score: totalPercentage > 0 ? courseScore : 0,
      percentageGraded: totalPercentage
    }
  }

  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 max-w-screen-lg">
        <div className="text-3xl font-semibold mb-8 text-gray-900">
          Courses
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 max-w-screen-lg"
    >
      <motion.h1 
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-semibold mb-8 text-gray-900"
      >
        Courses
      </motion.h1>

      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/add-course">
          <Button className="mb-8 px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white transition-colors">
            Add new course
          </Button>
        </Link>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {courses.map((course, index) => {
          const { score, percentageGraded } = calculateCourseProgress(course.id)
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: 0.05 * index }}
            >
              <Link href={`/course/${course.id}`}>
                <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 h-full border-0 bg-gray-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium text-gray-900">{course.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Progress</span>
                        <span className="text-sm font-medium text-gray-900">{score.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gray-900 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <div className="pt-2 space-y-1.5">
                        <p className="text-sm">
                          <span className="text-gray-500">{course.code}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">{course.term}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
