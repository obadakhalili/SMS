import React from "react"

import { Student } from "../SMS"

import Accordion from "react-bootstrap/Accordion"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import { FiChevronDown } from "react-icons/fi"

export default function ({ student }: { student: Student }) {
  return (
    <Accordion>
      <ListGroupItem>
        <Row className="align-items-center">
          <Col sm={11}>{student.name}</Col>
          <Col sm={1}>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              <FiChevronDown />
            </Accordion.Toggle>
          </Col>
        </Row>
      </ListGroupItem>
      <Accordion.Collapse eventKey="0">
        <Card.Body>
          <Card.Title>{student.dob}</Card.Title>
          <Card.Title>{student.gpa}</Card.Title>
        </Card.Body>
      </Accordion.Collapse>
    </Accordion>
  )
}
