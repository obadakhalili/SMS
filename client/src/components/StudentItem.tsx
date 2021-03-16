import React, { useState } from "react"

import { Student } from "../SMS"

import Accordion from "react-bootstrap/Accordion"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"

import { FiEdit2, FiTrash, FiChevronDown, FiChevronUp } from "react-icons/fi"

export default function ({ student }: { student: Student }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Accordion>
      <ListGroupItem>
        <Row>
          <Col md={9} className="text-truncate mb-2">
            {student.name}
          </Col>
          <Col md={3}>
            <Row className="align-items-center no-gutters">
              <Col className="d-flex justify-content-center">
                <Button variant="success">
                  <FiEdit2 />
                </Button>
              </Col>
              <Col className="d-flex justify-content-center">
                <Button variant="danger">
                  <FiTrash />
                </Button>
              </Col>
              <Col className="d-flex justify-content-center">
                <Accordion.Toggle
                  onClick={handleCollapseArrowClick}
                  as={Button}
                  variant="link"
                  eventKey="0"
                >
                  {collapsed ? <FiChevronUp /> : <FiChevronDown />}
                </Accordion.Toggle>
              </Col>
            </Row>
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

  function handleCollapseArrowClick() {
    setCollapsed(!collapsed)
  }
}
