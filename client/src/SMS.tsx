import React, { useEffect, useMemo, useState } from "react"

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
  collapsed: boolean
}

export type Students = Student[]

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
    apiService<Omit<Student, "collapsed">[]>(services.getStudents).then(
      (response) => {
        if ("error" in response) {
          return console.log(response)
        }

        setStudents(
          response.map((student) => ({ ...student, collapsed: false }))
        )
      }
    )
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
          <ListGroup students={filteredStudents} />
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
}
