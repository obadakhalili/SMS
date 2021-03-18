import React, { useState } from "react"

import { Students } from "../SMS"

import ListGroup from "react-bootstrap/ListGroup"
import Modal from "react-bootstrap/Modal"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalTitle from "react-bootstrap/ModalTitle"
import ModalFooter from "react-bootstrap/ModalFooter"
import Button from "react-bootstrap/Button"

import StudentItem from "./StudentItem"

export type ConfirmationModalDetails = { title: string; action: () => void }

export default function ({ students, ...props }: { students: Students, className: string }) {
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false)
  const [
    confirmationModalDetails,
    setConfirmationModalDetails,
  ] = useState<ConfirmationModalDetails>({ title: "", action: () => undefined })

  return (
    <>
      <ListGroup {...props}>
        {students.map((student) => (
          <StudentItem
            key={student.uuid}
            student={student}
            openConfirmationModal={openConfirmationModal}
          />
        ))}
      </ListGroup>
      <Modal show={confirmationModalIsOpen} onHide={handleModalClose} size="sm">
        <ModalHeader>
          <ModalTitle>{confirmationModalDetails.title}</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={handleModalClose} variant="secondary">
            Nope
          </Button>
          <Button onClick={handleModalActionButtonClick} variant="primary">
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )

  function handleModalClose() {
    setConfirmationModalIsOpen(false)
  }

  function openConfirmationModal(details: ConfirmationModalDetails) {
    setConfirmationModalDetails(details)
    setConfirmationModalIsOpen(true)
  }

  function handleModalActionButtonClick() {
    setConfirmationModalIsOpen(false)
    confirmationModalDetails.action()
  }
}
