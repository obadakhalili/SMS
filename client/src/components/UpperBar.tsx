import React, { ChangeEvent, FormEvent, useEffect, useState } from "react"

import { useAlert } from "react-alert"

import { NewStudentInfo } from "../SMS"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import FormGroup from "react-bootstrap/FormGroup"
import FormLabel from "react-bootstrap/FormLabel"
import FormControl from "react-bootstrap/FormControl"
import FormText from "react-bootstrap/FormText"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalTitle from "react-bootstrap/ModalTitle"
import ModalBody from "react-bootstrap/ModalBody"
import ModalFooter from "react-bootstrap/ModalFooter"

import { FiPlus } from "react-icons/fi"

export default function ({
  searchValue,
  updateSearchValue,
  addStudent,
  ...props
}: {
  searchValue: string
  updateSearchValue: (newSearchValue: string) => void
  addStudent: (studentInfo: NewStudentInfo) => void
  className: string
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const [studentInfo, setStudentInfo] = useState<NewStudentInfo>({
    name: "",
    dob: "",
    gpa: 4,
  })

  const alert = useAlert()

  return (
    <div {...props}>
      <Row className="align-items-end">
        <Col sm={9} md={10} lg={11} className="mb-1">
          <FormGroup className="mb-0">
            <FormLabel>Search</FormLabel>
            <FormControl
              value={searchValue}
              onChange={handleInputChange}
              placeholder="Search by name/dob/gpa .."
            />
          </FormGroup>
        </Col>
        <Col sm={3} md={2} lg={1} className="mb-1">
          <Button
            onClick={handleModalOpenButton}
            variant="primary"
            className="w-100"
          >
            <FiPlus />
          </Button>
        </Col>
      </Row>
      <Modal
        show={modalIsOpen}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle>Enter new student info</ModalTitle>
        </ModalHeader>
        <Form onSubmit={handleFormSubmit}>
          <ModalBody>
            <FormGroup>
              <FormLabel>Name</FormLabel>
              <FormControl
                value={studentInfo.name}
                onChange={handleFormChange}
                name="name"
                placeholder="Enter student name"
              />
              <FormText className="text-muted">
                A maximum of 50 characters
              </FormText>
            </FormGroup>
            <FormGroup>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl
                value={studentInfo.dob}
                onChange={handleFormChange}
                name="dob"
                placeholder="Enter student dob"
              />
              <FormText className="text-muted">
                Should comply to the ISO format (YYYY-MM-DD)
              </FormText>
            </FormGroup>
            <FormGroup>
              <FormLabel>GPA</FormLabel>
              <FormControl
                value={studentInfo.gpa}
                onChange={handleFormChange}
                name="gpa"
                placeholder="Enter student gpa"
              />
              <FormText className="text-muted">
                Should fall in the range of 0 to 4
              </FormText>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Add
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  )

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    updateSearchValue(e.target.value)
  }

  function handleModalOpenButton() {
    setModalIsOpen(true)
  }

  function handleModalClose() {
    setModalIsOpen(false)
  }

  function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const numericGpa = Number(studentInfo.gpa)

    if (studentInfo.gpa && !isNaN(numericGpa)) {
      addStudent({ ...studentInfo, gpa: numericGpa })
      return setModalIsOpen(false)
    }

    alert.error("The GPA field must be a valid number")
  }

  function handleFormChange(e: ChangeEvent<HTMLInputElement>) {
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value })
  }
}
