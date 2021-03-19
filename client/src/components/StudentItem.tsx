import React, { ChangeEvent, useContext, useState } from "react"

import { useAccordionToggle } from "react-bootstrap"

import { NewStudentInfo, Student, StudentContext } from "../SMS"
import { ConfirmationModalDetails } from "./StudentsList"

import Accordion from "react-bootstrap/Accordion"
import ListGroupItem from "react-bootstrap/ListGroupItem"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import FormControl from "react-bootstrap/FormControl"

import {
  FiCheck,
  FiEdit2,
  FiTrash,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi"

function EditStudentButton({
  isCollapsed,
  setIsCollapsed,
  isInEditMode,
  setIsInEditMode,
  handleSaveButtonClick,
  eventKey,
}: {
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: true) => void
  isInEditMode: boolean
  setIsInEditMode: (isInEditMode: true) => void
  handleSaveButtonClick: () => void
  eventKey: string
}) {
  const decoratedOnClick = useAccordionToggle(eventKey, () =>
    setIsCollapsed(true)
  )

  return isInEditMode ? (
    <Button onClick={handleSaveButtonClick} variant="secondary">
      <FiCheck />
    </Button>
  ) : (
    <Button onClick={handleToggleButtonClick} variant="success">
      <FiEdit2 />
    </Button>
  )

  function handleToggleButtonClick(e: any) {
    setIsInEditMode(true)

    if (!isCollapsed) {
      decoratedOnClick(e)
    }
  }
}

export default function StudentItem({
  student,
  openConfirmationModal,
}: {
  student: Student
  openConfirmationModal: (details: ConfirmationModalDetails) => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const [isInEditMode, setIsInEditMode] = useState(false)

  const [newStudentInfo, setNewStudentInfo] = useState<NewStudentInfo>({
    name: student.name,
    dob: student.dob,
    gpa: student.gpa,
  })

  const studentContext = useContext(StudentContext)

  return (
    <Accordion>
      <ListGroupItem>
        <Row>
          <Col md={9} className="text-truncate mb-2">
            {isInEditMode ? (
              <FormControl
                value={newStudentInfo.name}
                onChange={handleFormChange}
                name="name"
                placeholder="New name"
              />
            ) : (
              student.name
            )}
          </Col>
          <Col md={3}>
            <Row className="align-items-center no-gutters">
              <Col>
                <Row className="justify-content-center">
                  <EditStudentButton
                    isCollapsed={isCollapsed}
                    isInEditMode={isInEditMode}
                    setIsCollapsed={setIsCollapsed}
                    setIsInEditMode={setIsInEditMode}
                    handleSaveButtonClick={handleSaveButtonClick}
                    eventKey="0"
                  />
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
                    {isCollapsed ? <FiChevronUp /> : <FiChevronDown />}
                  </Accordion.Toggle>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </ListGroupItem>
      <Accordion.Collapse eventKey="0">
        <Card.Body>
          <Card.Title>
            {isInEditMode ? (
              <FormControl
                value={newStudentInfo.dob}
                onChange={handleFormChange}
                name="dob"
                placeholder="New dob"
              />
            ) : (
              student.dob
            )}
          </Card.Title>
          <Card.Title>
            {isInEditMode ? (
              <FormControl
                value={newStudentInfo.gpa}
                onChange={handleFormChange}
                name="gpa"
                placeholder="New gpa"
              />
            ) : (
              student.gpa
            )}
          </Card.Title>
        </Card.Body>
      </Accordion.Collapse>
    </Accordion>
  )

  function handleSaveButtonClick() {
    const studentInfoChanged = Object.entries(newStudentInfo).some(
      ([key, value]) => value !== student[key as keyof NewStudentInfo]
    )

    if (studentInfoChanged) {
      return openConfirmationModal({
        title: `Sure you want to save student ${student.name} new info?`,
        action: async () => {
          const wentWell = await studentContext.updateStudent(
            student.uuid,
            newStudentInfo
          )
          wentWell && setIsInEditMode(false)
        },
      })
    }

    setIsInEditMode(false)
  }

  function handleDeleteButtonClick() {
    openConfirmationModal({
      title: `Sure you want to delete student ${student.name}?`,
      action: () => studentContext.deleteStudent(student.uuid),
    })
  }

  function handleCollapseArrowClick() {
    setIsCollapsed(!isCollapsed)
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    setNewStudentInfo({ ...newStudentInfo, [e.target.name]: e.target.value })
  }
}
