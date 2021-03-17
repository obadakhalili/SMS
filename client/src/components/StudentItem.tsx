import React, { useContext, useState } from "react"

import { Student, StudentContext } from "../SMS"
import { ConfirmationModalDetails } from "./StudentsList"

import Accordion from "react-bootstrap/Accordion"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"

import { FiEdit2, FiTrash, FiChevronDown, FiChevronUp } from "react-icons/fi"

export default function ({
  student,
  openConfirmationModal,
}: {
  student: Student
  openConfirmationModal: (details: ConfirmationModalDetails) => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const studentContext = useContext(StudentContext)

  return (
    <Accordion>
      <ListGroupItem>
        <Row>
          <Col md={9} className="text-truncate mb-2">
            {student.name}
          </Col>
          <Col md={3}>
            <Row className="align-items-center no-gutters">
              <Col>
                <Row className="justify-content-center">
                  <Button variant="success">
                    <FiEdit2 />
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-center">
                  <Button onClick={handleDeleteButtonClick} variant="danger">
                    <FiTrash />
                  </Button>
                </Row>
              </Col>
              <Col>
                <Row className="justify-content-center">
                  <Accordion.Toggle
                    onClick={handleCollapseArrowClick}
                    as={Button}
                    variant="link"
                    eventKey="0"
                  >
                    {collapsed ? <FiChevronUp /> : <FiChevronDown />}
                  </Accordion.Toggle>
                </Row>
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

  function handleDeleteButtonClick() {
    openConfirmationModal({
      title: `Sure you want to delete student ${student.name}?`,
      action: () => studentContext.deleteStudent(student.uuid),
    })
  }
}
