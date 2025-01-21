import { localStorage, type Course } from "@/utils/localStorage"

export function seedCourses() {
  const coursesToSeed: Omit<Course, "id">[] = [
    {
      name: "CYBERSECURITY THREATS AND MITIGATION",
      code: "COMPSCI 9851 001",
      term: "2025 Winter Graduate",
      endDate: "2026-05-01",
    },
    {
      name: "MACHINE LEARNING",
      code: "COMPSCI 9860 001",
      term: "2025 Winter Graduate",
      endDate: "2026-05-01",
    },
    {
      name: "DEPENDABLE ARTIFICIAL INTELLIGENCE SYSTEMS",
      code: "COMPSCI 9874 001",
      term: "2025 Winter Graduate",
      endDate: "2026-05-01",
    },
  ]

  const existingCourses = localStorage.getCourses()
  const newCourses = coursesToSeed.filter((course) => !existingCourses.some((c) => c.code === course.code))

  newCourses.forEach((course) => {
    localStorage.addCourse(course)
  })
}

