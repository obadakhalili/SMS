import React, { createContext, useEffect, useMemo, useState } from "react"

import { useAlert } from "react-alert"

import apiService, { services } from "./apiService"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"

import UpperBar from "./components/UpperBar"
import StudentsList from "./components/StudentsList"

export type Student = {
  uuid: string
  name: string
  dob: string
  gpa: number
}

export type NewStudentInfo = Omit<Student, "uuid">

export type Students = Student[]

export const StudentContext = createContext(
  {} as {
    updateStudent: (
      uuid: string,
      newStudentInfo: NewStudentInfo
    ) => Promise<boolean>
    deleteStudent: (uuid: string) => void
  }
)

export default function SMS() {
  const [searchValue, setSearchValue] = useState("")

  const [isLoading, setIsLoading] = useState(true)

  const alert = useAlert()

  const [students, setStudents] = useState<Students>([])

  const filteredStudents = useMemo(() => {
    const comparator = searchValue.trim().toLowerCase()
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(comparator) ||
        student.dob.toLowerCase().includes(comparator) ||
        String(student.gpa).toLowerCase().includes(comparator)
    )
  }, [searchValue, students])

  useEffect(() => {
    apiService<Students>(services.getStudents).then((response) => {
      setIsLoading(false)

      if ("error" in response) {
        return response.messages.forEach((message) => alert.error(message))
      }

      setStudents(
        response.map((student) => ({
          ...student,
          dob: formatToISODate(student.dob),
        }))
      )
    })
  }, [])

  return (
    <Container className="mt-5">
      <h1 className="text-center">
        Welcome to <span className="text-primary">SMS</span>
      </h1>
      <UpperBar
        searchValue={searchValue}
        updateSearchValue={setSearchValue}
        addStudent={addStudent}
        className="my-5"
      />
      {isLoading ? (
        <Row className="justify-content-center">
          <Spinner animation="border" variant="primary" />
        </Row>
      ) : filteredStudents.length ? (
        <StudentContext.Provider value={{ deleteStudent, updateStudent }}>
          <StudentsList students={filteredStudents} className="students-list" />
        </StudentContext.Provider>
      ) : (
        <strong>No students to show</strong>
      )}
    </Container>
  )

  async function updateStudent(uuid: string, newStudentInfo: NewStudentInfo) {
    const response = await apiService<void>(() =>
      services.updateStudent(uuid, newStudentInfo)
    )

    if (response) {
      response.messages.forEach((message) => alert.error(message))
      return false
    }

    const studentToUpdate = students.find((student) => student.uuid === uuid)
    Object.assign(studentToUpdate, newStudentInfo)
    setStudents([...students])
    return true
  }

  async function deleteStudent(uuid: string) {
    const response = await apiService<void>(() => services.deleteStudent(uuid))

    if (response) {
      return response.messages.forEach((message) => alert.error(message))
    }

    setStudents(students.filter((student) => student.uuid !== uuid))
  }

  async function addStudent(studentInfo: NewStudentInfo) {
    const response = await apiService<{ uuid: string }>(() =>
      services.addStudent(studentInfo)
    )

    if ("error" in response) {
      return response.messages.forEach((message) => alert.error(message))
    }

    setStudents([...students, { ...studentInfo, ...response }])
  }
}

function formatToISODate(date: string) {
  const dateObject = new Date(date)
  return `${String(dateObject.getFullYear()).padStart(4, "0")}-${String(
    dateObject.getMonth() + 1
  ).padStart(2, "0")}-${String(dateObject.getDate()).padStart(2, "0")}`
}
