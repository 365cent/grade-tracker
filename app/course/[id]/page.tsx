"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { localStorage, type Course, type Coursework } from "@/utils/localStorage"
import { PieChart } from 'react-minimal-pie-chart'
import { motion } from "framer-motion"

export default function CoursePage() {
  const { id } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [coursework, setCoursework] = useState<Coursework[]>([])
  const [newCoursework, setNewCoursework] = useState<Omit<Coursework, "id" | "courseId">>({
    name: "",
    type: "assignment",
    percentage: 0,
  })
  const [editingCoursework, setEditingCoursework] = useState<string | null>(null)

  useEffect(() => {
    const foundCourse = localStorage.getCourses().find((c) => c.id === id)
    if (foundCourse) {
      setCourse(foundCourse)
      setCoursework(localStorage.getCoursework().filter((cw) => cw.courseId === id))
    }
  }, [id])

  const handleAddCoursework = (e: React.FormEvent) => {
    e.preventDefault()
    if (course) {
      const added = localStorage.addCoursework({ ...newCoursework, courseId: course.id })
      setCoursework([...coursework, added])
      setNewCoursework({ name: "", type: "assignment", percentage: 0 })
    }
  }

  const handleUpdateGrade = (courseworkId: string, grade: number) => {
    const updated = coursework.map((cw) => (cw.id === courseworkId ? { ...cw, grade } : cw))
    localStorage.setCoursework(updated)
    setCoursework(updated)
  }

  const handleUpdateCoursework = (courseworkId: string, updates: Partial<Coursework>) => {
    const updated = coursework.map((cw) => 
      cw.id === courseworkId ? { ...cw, ...updates } : cw
    )
    localStorage.setCoursework(updated)
    setCoursework(updated)
  }

  const handleDeleteCoursework = (courseworkId: string) => {
    const filtered = coursework.filter((cw) => cw.id !== courseworkId)
    localStorage.setCoursework(filtered)
    setCoursework(filtered)
  }

  const calculateTotalScore = () => {
    let totalScore = 0
    let totalPercentage = 0
    coursework.forEach(cw => {
      if (cw.grade !== undefined) {
        totalScore += (cw.grade * cw.percentage) / 100
        totalPercentage += cw.percentage
      }
    })
    return { totalScore, totalPercentage }
  }

  if (!course) return <div>Loading...</div>

  const { totalScore, totalPercentage } = calculateTotalScore()

  return (
    <div className="container mx-auto p-4 max-w-screen-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">
          {course.name}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="flex items-center text-gray-700">
                <span className="font-medium w-24">Code:</span>
                <span>{course.code}</span>
              </p>
              <p className="flex items-center text-gray-700">
                <span className="font-medium w-24">Term:</span>
                <span>{course.term}</span>
              </p>
              <p className="flex items-center text-gray-700">
                <span className="font-medium w-24">End Date:</span>
                <span>{course.endDate}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Current Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-40 h-40 mb-4">
                <PieChart
                  data={[
                    { title: 'Completed', value: totalPercentage, color: '#000000' },
                    { title: 'Remaining', value: 100 - totalPercentage, color: '#E5E7EB' }
                  ]}
                  lineWidth={20}
                  rounded
                  animate
                />
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">{totalScore.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">{totalPercentage}% of course graded</p>
            </CardContent>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Add Coursework</h2>
          <Card className="bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <form onSubmit={handleAddCoursework} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Coursework Name</Label>
                  <Input
                    id="name"
                    value={newCoursework.name}
                    onChange={(e) => setNewCoursework({ ...newCoursework, name: e.target.value })}
                    required
                    className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-gray-700">Type</Label>
                  <select
                    id="type"
                    value={newCoursework.type}
                    onChange={(e) => setNewCoursework({ ...newCoursework, type: e.target.value as Coursework["type"] })}
                    className="w-full mt-1 p-2 border rounded transition-all duration-300 focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  >
                    <option value="assignment">Assignment</option>
                    <option value="lab">Lab</option>
                    <option value="participation">Participation</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="percentage" className="text-gray-700">Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={newCoursework.percentage}
                    onChange={(e) => setNewCoursework({ ...newCoursework, percentage: Number(e.target.value) })}
                    required
                    className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-black hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add Coursework
                </Button>
              </form>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-gray-800 mt-8">Current Coursework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coursework.map((cw) => (
              <motion.div
                key={cw.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="flex flex-row justify-between items-center pb-2">
                    {editingCoursework === cw.id ? (
                      <Input
                        value={cw.name}
                        onChange={(e) => handleUpdateCoursework(cw.id, { name: e.target.value })}
                        className="text-gray-800 font-semibold"
                      />
                    ) : (
                      <CardTitle className="text-xl text-gray-800">{cw.name}</CardTitle>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (editingCoursework === cw.id) {
                            setEditingCoursework(null)
                          } else {
                            setEditingCoursework(cw.id)
                          }
                        }}
                        className="hover:bg-gray-100"
                      >
                        {editingCoursework === cw.id ? 'Done' : 'Edit'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteCoursework(cw.id)}
                        className="hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium w-24">Type:</span>
                      {editingCoursework === cw.id ? (
                        <select
                          value={cw.type}
                          onChange={(e) => handleUpdateCoursework(cw.id, { type: e.target.value as Coursework["type"] })}
                          className="p-1 border rounded focus:ring-2 focus:ring-black"
                        >
                          <option value="assignment">Assignment</option>
                          <option value="quiz">Quiz</option>
                          <option value="exam">Exam</option>
                          <option value="project">Project</option>
                        </select>
                      ) : (
                        <span className="capitalize">{cw.type}</span>
                      )}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium w-24">Percentage:</span>
                      {editingCoursework === cw.id ? (
                        <Input
                          type="number"
                          value={cw.percentage}
                          onChange={(e) => handleUpdateCoursework(cw.id, { percentage: Number(e.target.value) })}
                          className="w-24 focus:ring-2 focus:ring-black"
                        />
                      ) : (
                        <span>{cw.percentage}%</span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`grade-${cw.id}`} className="text-gray-700">Grade</Label>
                      <Input
                        id={`grade-${cw.id}`}
                        type="number"
                        value={cw.grade || ""}
                        onChange={(e) => handleUpdateGrade(cw.id, Number(e.target.value))}
                        placeholder="Enter grade"
                        className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Link href="/">
          <Button className="mt-8 w-full bg-black hover:bg-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl">
            Back to Courses
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
