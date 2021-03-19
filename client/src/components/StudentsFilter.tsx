import React, { ChangeEvent } from "react"

import FormGroup from "react-bootstrap/FormGroup"
import FormLabel from "react-bootstrap/FormLabel"
import FormControl from "react-bootstrap/FormControl"

export default function StudentsFilter({
  searchValue,
  updateSearchValue,
  ...props
}: {
  searchValue: string
  updateSearchValue: (newSearchValue: string) => void
  className: string
}) {
  return (
    <FormGroup {...props}>
      <FormLabel>Search</FormLabel>
      <FormControl
        value={searchValue}
        onChange={handleInputChange}
        placeholder="Search by name/dob/gpa .."
      />
    </FormGroup>
  )

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    updateSearchValue(e.target.value)
  }
}
