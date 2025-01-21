export interface Course {
  id: string
  name: string
  code: string
  term: string
  endDate: string
}

export interface Coursework {
  id: string
  courseId: string
  name: string
  type: "assignment" | "lab" | "participation" | "quiz" | "exam" | "project" | "other"
  percentage: number
  grade?: number
}

class LocalStorage {
  private storage: Storage | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.storage = window.localStorage
    }
  }

  private getItem<T>(key: string): T[] {
    if (!this.storage) return []
    const item = this.storage.getItem(key)
    return item ? JSON.parse(item) : []
  }

  private setItem<T>(key: string, value: T[]): void {
    if (!this.storage) return
    this.storage.setItem(key, JSON.stringify(value))
  }

  getCourses(): Course[] {
    return this.getItem<Course>("courses")
  }

  setCourses(courses: Course[]): void {
    this.setItem("courses", courses)
  }

  getCoursework(): Coursework[] {
    return this.getItem<Coursework>("coursework")
  }

  setCoursework(coursework: Coursework[]): void {
    this.setItem("coursework", coursework)
  }

  addCourse(course: Omit<Course, "id">): Course {
    const courses = this.getCourses()
    const newCourse = { ...course, id: this.generateId() }
    courses.push(newCourse)
    this.setCourses(courses)
    return newCourse
  }

  updateCourse(course: Course): void {
    const courses = this.getCourses()
    const index = courses.findIndex((c) => c.id === course.id)
    if (index !== -1) {
      courses[index] = course
      this.setCourses(courses)
    }
  }

  deleteCourse(id: string): void {
    const courses = this.getCourses()
    const newCourses = courses.filter((course) => course.id !== id)
    this.setCourses(newCourses)

    // Also delete associated coursework
    const coursework = this.getCoursework()
    const newCoursework = coursework.filter((cw) => cw.courseId !== id)
    this.setCoursework(newCoursework)
  }

  addCoursework(coursework: Omit<Coursework, "id">): Coursework {
    const allCoursework = this.getCoursework()
    const newCoursework = { ...coursework, id: this.generateId() }
    allCoursework.push(newCoursework)
    this.setCoursework(allCoursework)
    return newCoursework
  }

  updateCoursework(coursework: Coursework): void {
    const allCoursework = this.getCoursework()
    const index = allCoursework.findIndex((cw) => cw.id === coursework.id)
    if (index !== -1) {
      allCoursework[index] = coursework
      this.setCoursework(allCoursework)
    }
  }

  deleteCoursework(id: string): void {
    const coursework = this.getCoursework()
    const newCoursework = coursework.filter((cw) => cw.id !== id)
    this.setCoursework(newCoursework)
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}

export const localStorage = new LocalStorage()

