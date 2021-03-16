import React, { createContext, useEffect, useMemo, useState } from "react"

import apiService, { services } from "./apiService"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"

import SearchBar from "./components/SearchBar"
import ListGroup from "./components/StudentsList"

export type Student = {
  uuid: string
  name: string
  dob: string
  gpa: number
}

export type Students = Student[]

export const StudentContext = createContext(
  {} as { [key: string]: (uuid: string) => void }
)

export default function SMS() {
  const [searchValue, setSearchValue] = useState("")

  const [students, setStudents] = useState<Students | null>(null)

  const filteredStudents = useMemo(() => {
    if (students) {
      const comparator = searchValue.trim().toLowerCase()
      return students.filter(
        (student) =>
          student.name.toLowerCase().includes(comparator) ||
          student.dob.toLowerCase().includes(comparator) ||
          String(student.gpa).toLowerCase().includes(comparator)
      )
    }
  }, [students, searchValue])

  useEffect(() => {
    apiService<Students>(services.getStudents).then((response) => {
      if ("error" in response) {
        return console.log(response) // Display alerts
      }

      setStudents(response)
    })
  }, [])

  return (
    <Container className="mt-5">
      <h1 className="text-center">
        Welcome to <span className="text-primary">SMS</span>
      </h1>
      <SearchBar
        searchValue={searchValue}
        updateSearchValue={updateSearchValue}
        className="my-5"
      />
      {filteredStudents ? (
        filteredStudents.length ? (
          <StudentContext.Provider value={{ deleteStudent }}>
            <ListGroup students={filteredStudents} />
          </StudentContext.Provider>
        ) : (
          <strong>No students to show</strong>
        )
      ) : (
        <Row className="justify-content-center">
          <Spinner animation="border" variant="primary" />
        </Row>
      )}
    </Container>
  )

  function updateSearchValue(newSearchValue: string) {
    setSearchValue(newSearchValue)
  }

  async function deleteStudent(uuid: string) {
    const response = await apiService<void>(() => services.deleteStudent(uuid))

    if (response) {
      return console.log(response) // Display alerts
    }

    setStudents(
      (students as Students).filter((student) => student.uuid !== uuid)
    )
  }
}
