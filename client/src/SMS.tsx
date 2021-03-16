import React, { useEffect, useState } from "react"

import apiService, { services } from "./apiService"

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Spinner from "react-bootstrap/Spinner"

import SearchBar from "./components/SearchBar"

export type Student = {
  uuid: string
  name: string
  dob: string
  gpa: number
  collapsed: boolean
}

type Students = Student[]

export default function SMS() {
  const [searchValue, setSearchValue] = useState("")

  const [students, setStudents] = useState<Students | null>(null)

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
      {students ? (
        students.length ? (
          "list"
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
