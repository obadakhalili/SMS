import React, { useEffect, useState } from "react"

import { Students } from "../SMS"

import ListGroup from "react-bootstrap/ListGroup"
import Modal from "react-bootstrap/Modal"
import ModalHeader from "react-bootstrap/ModalHeader"
import ModalTitle from "react-bootstrap/ModalTitle"
import ModalFooter from "react-bootstrap/ModalFooter"
import Button from "react-bootstrap/Button"

import StudentItem from "./StudentItem"

export type ConfirmationModalDetails = { title: string; action: () => void }

export default function ({ students }: { students: Students }) {
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false)
  const [
    confirmationModalDetails,
    setConfirmationModalDetails,
  ] = useState<ConfirmationModalDetails>({ title: "", action: () => undefined })

  return (
    <>
      <ListGroup>
        {students.map((student) => (
          <StudentItem
            key={student.uuid}
            student={student}
            openConfirmationModal={openConfirmationModal}
          />
        ))}
      </ListGroup>
      <Modal show={confirmationModalIsOpen} onHide={handleModalCloseButton}>
        <ModalHeader>
          <ModalTitle>{confirmationModalDetails.title}</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <Button onClick={handleModalCloseButton} variant="secondary">
            Nope
          </Button>
          <Button onClick={confirmationModalDetails.action} variant="primary">
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )

  function handleModalCloseButton() {
    setConfirmationModalIsOpen(false)
  }

  function openConfirmationModal(details: ConfirmationModalDetails) {
    setConfirmationModalDetails(details)
    setConfirmationModalIsOpen(true)
  }
}
