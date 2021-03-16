import React, { ChangeEvent } from "react"

import Form from "react-bootstrap/Form"

export default function ({
  searchValue,
  updateSearchValue,
  className,
}: {
  searchValue: string
  updateSearchValue: (newSearchValue: string) => void
  className: string
}) {
  return (
    <Form.Group className={className}>
      <Form.Label>Search</Form.Label>
      <Form.Control
        value={searchValue}
        onChange={handleInputChange}
        placeholder="Search by name/dob/gpa .."
      />
    </Form.Group>
  )

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    updateSearchValue(e.target.value)
  }
}
