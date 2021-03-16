import React from "react"

import { Students } from "../SMS"

import ListGroup from "react-bootstrap/ListGroup"

import StudentItem from "./StudentItem"

export default function ({ students }: { students: Students }) {
  return (
    <ListGroup>
      {students.map((student) => (
        <StudentItem key={student.uuid} student={student} />
      ))}
    </ListGroup>
  )
}
