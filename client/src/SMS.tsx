import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useState,
  useEffect,
  useMemo,
} from "react"

import Typography from "@material-ui/core/Typography"
import blue from "@material-ui/core/colors/blue"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Box from "@material-ui/core/Box"
import TextField from "@material-ui/core/TextField"
import List from "@material-ui/core/list"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Collapse from "@material-ui/core/Collapse"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"

import Alert from "@material-ui/lab/Alert"

import AddIcon from "@material-ui/icons/Add"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import GradeIcon from "@material-ui/icons/Grade"
import CloseIcon from "@material-ui/icons/Close"

import apiService, { services } from "./apiService"

export type Student = {
  uuid: string
  name: string
  dob: string
  gpa: number
  collapsed: boolean
}

type Students = Student[]

export type NewStudentInfo = Omit<Student, "uuid" | "collapsed">

type ConfirmationDialogDetails = {
  title: string
  action: () => void
}

type AlertDetails = {
  type: "error" | "success"
  message: string
  open: boolean
}

type Alerts = AlertDetails[]

function StudentFilter(props: {
  searchValue: string
  updateSearchValue: (newSearchValue: string) => void
}) {
  const { searchValue, updateSearchValue } = props

  return (
    <TextField
      value={searchValue}
      onChange={(e) => updateSearchValue(e.target.value)}
      label="Search"
      variant="outlined"
      placeholder="Search by name/dob/gpa .."
      fullWidth
    />
  )
}

function StudentAddition(props: {
  addStudent: (newStudent: NewStudentInfo) => void
  handleInvalidGpa: () => void
}) {
  const { addStudent, handleInvalidGpa } = props

  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [newStudent, setNewStudent] = useState<NewStudentInfo>({
    name: "Obada Khalili",
    dob: "2001-04-26",
    gpa: 4,
  })

  return (
    <>
      <Button
        onClick={() => setDialogIsOpen(true)}
        variant="contained"
        color="primary"
        fullWidth
      >
        <AddIcon />
      </Button>
      <Dialog open={dialogIsOpen} onClose={() => setDialogIsOpen(false)}>
        <DialogTitle>Add student</DialogTitle>
        <form onSubmit={submitStudent}>
          <DialogContent>
            <Box mb={2}>
              <TextField
                value={newStudent.name}
                onChange={handleFormChange}
                name="name"
                label="Student Name"
                autoFocus
                fullWidth
              />
            </Box>
            <Box mb={2}>
              <TextField
                value={newStudent.dob}
                onChange={handleFormChange}
                name="dob"
                type="date"
                label="Date of Birth"
                fullWidth
              />
            </Box>
            <TextField
              value={newStudent.gpa}
              onChange={handleFormChange}
              name="gpa"
              type="number"
              label="GPA"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogIsOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )

  function handleFormChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  function submitStudent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    newStudent.gpa = Number(newStudent.gpa)

    if (newStudent.gpa) {
      return addStudent(newStudent)
    }

    handleInvalidGpa()
  }
}

function StudentItem(props: {
  student: Student
  toggleStudentCollapse: (uuid: string) => void
  openConfirmationDialog: (details: ConfirmationDialogDetails) => void
  deleteStudent: (uuid: string) => void
  updateStudent: (
    uuid: string,
    newStudentInfo: NewStudentInfo
  ) => Promise<void | true>
}) {
  const {
    student,
    toggleStudentCollapse,
    openConfirmationDialog,
    deleteStudent,
    updateStudent,
  } = props

  const [isInEditMode, setIsInEditMode] = useState(false)
  const [newStudentInfo, setNewStudentInfo] = useState<NewStudentInfo>({
    name: student.name,
    dob: formatToValidDate(student.dob),
    gpa: student.gpa,
  })

  return (
    <>
      <ListItem onClick={() => toggleStudentCollapse(student.uuid)} button>
        <ListItemIcon>
          {student.collapsed ? <ExpandLess /> : <ExpandMore />}
        </ListItemIcon>
        {isInEditMode ? (
          <>
            <TextField
              value={newStudentInfo.name}
              onChange={handleFormChange}
              onClick={stopPropagation}
              name="name"
              label="New Name"
              autoFocus
              fullWidth
            />
            <Button
              onClick={(e) => stopPropagation(e, confirmStudentUpdation)}
              variant="contained"
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <ListItemText>{student.name}</ListItemText>
            <Button>
              <EditRoundedIcon
                onClick={(e) =>
                  student.collapsed
                    ? stopPropagation(e, () => setIsInEditMode(true))
                    : setIsInEditMode(true)
                }
                color="action"
              />
            </Button>
          </>
        )}
        <Button onClick={(e) => stopPropagation(e, confirmStudentDeletion)}>
          <DeleteForeverRoundedIcon color="secondary" />
        </Button>
      </ListItem>
      <Collapse in={student.collapsed}>
        <Box pl={4}>
          <List>
            <ListItem>
              <ListItemIcon>
                <CalendarTodayIcon />
              </ListItemIcon>
              {isInEditMode ? (
                <TextField
                  value={newStudentInfo.dob}
                  onChange={handleFormChange}
                  name="dob"
                  type="date"
                  fullWidth
                />
              ) : (
                <ListItemText>{student.dob}</ListItemText>
              )}
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
              {isInEditMode ? (
                <TextField
                  value={newStudentInfo.gpa}
                  onChange={handleFormChange}
                  name="gpa"
                  type="number"
                  label="New GPA"
                  autoFocus
                  fullWidth
                />
              ) : (
                <ListItemText>{student.gpa}</ListItemText>
              )}
            </ListItem>
          </List>
        </Box>
      </Collapse>
    </>
  )

  function confirmStudentUpdation() {
    openConfirmationDialog({
      title: `Sure want to save new changes for ${student.name}?`,
      action: async () => {
        const numericGpa = Number(newStudentInfo.gpa)

        if (numericGpa) {
          newStudentInfo.gpa = numericGpa
          const wentWell = await updateStudent(student.uuid, newStudentInfo)

          if (wentWell) {
            setIsInEditMode(false)
          }
        }

        // handle error
      },
    })
  }

  function confirmStudentDeletion() {
    openConfirmationDialog({
      title: `Sure you want to delete ${student.name}?`,
      action: () => deleteStudent(student.uuid),
    })
  }

  function handleFormChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewStudentInfo({ ...newStudentInfo, [e.target.name]: e.target.value })
  }
}

function StudentList(props: {
  students: Students
  toggleStudentCollapse: (uuid: string) => void
  deleteStudent: (uuid: string) => void
  updateStudent: (
    uuid: string,
    newStudentInfo: NewStudentInfo
  ) => Promise<void | true>
}) {
  const {
    students,
    toggleStudentCollapse,
    deleteStudent,
    updateStudent,
  } = props

  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [dialogDetails, setDialogDetails] = useState<ConfirmationDialogDetails>(
    { title: "", action: () => undefined }
  )

  return (
    <>
      <List className="students-list">
        {students.map((student) => (
          <StudentItem
            key={student.uuid}
            student={student}
            toggleStudentCollapse={toggleStudentCollapse}
            openConfirmationDialog={openConfirmationDialog}
            deleteStudent={deleteStudent}
            updateStudent={updateStudent}
          ></StudentItem>
        ))}
      </List>
      <Dialog open={dialogIsOpen} onClose={() => setDialogIsOpen(false)}>
        <DialogTitle>{dialogDetails.title}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDialogIsOpen(false)} color="primary">
            Nope
          </Button>
          <Button onClick={confirmStudentDeletion} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )

  function openConfirmationDialog(details: ConfirmationDialogDetails) {
    setDialogDetails(details)
    setDialogIsOpen(true)
  }

  function confirmStudentDeletion() {
    dialogDetails.action()
    setDialogIsOpen(false)
  }
}

function AlertsView(props: {
  alerts: Alerts
  closeAlert: (alertIndex: number) => void
}) {
  const { alerts, closeAlert } = props

  return (
    <Box className="alerts-container">
      {alerts.map((alert, index) => (
        <Box key={index} mb={2}>
          <Collapse in={alert.open}>
            <Alert
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => closeAlert(index)}
                >
                  <CloseIcon />
                </IconButton>
              }
              severity={alert.type}
            >
              {alert.message}
            </Alert>
          </Collapse>
        </Box>
      ))}
    </Box>
  )
}

export default function SMS() {
  const [students, setStudents] = useState<Students>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiService<Omit<Student, "collapsed">[]>(services.getAllStudents).then(
      (response) => {
        if ("error" in response) {
          return setAlerts(toAlertsObjects(response.messages))
        }

        setStudents(
          response.map((student) => ({
            ...student,
            dob: new Date(student.dob).toLocaleDateString(),
            collapsed: false,
          }))
        )
        setIsLoading(false)
      }
    )
  }, [])

  const [searchValue, setSearchValue] = useState("")

  const filteredStudents = useMemo(() => {
    const comparator = searchValue.trim().toLowerCase()
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(comparator) ||
        student.dob.toLowerCase().includes(comparator) ||
        String(student.gpa).toLowerCase().includes(comparator)
    )
  }, [searchValue, students])

  const [alerts, setAlerts] = useState<Alerts>([])

  return (
    <Box mt={10}>
      <Container maxWidth="md">
        <Box mb={8}>
          <Typography variant="h3" component="h3" className="sms-header">
            Welcome to <span style={{ color: blue[500] }}>SMS</span>
          </Typography>
        </Box>
        <Box mb={5}>
          <Grid alignItems="center" justify="space-between" container>
            <Grid xs={10} item>
              <StudentFilter
                searchValue={searchValue}
                updateSearchValue={(newSearchValue) =>
                  setSearchValue(newSearchValue)
                }
              />
            </Grid>
            <Grid xs={1} item>
              <StudentAddition
                addStudent={addStudent}
                handleInvalidGpa={() =>
                  setAlerts([
                    { message: "GPA is invalid", type: "error", open: true },
                  ])
                }
              />
            </Grid>
          </Grid>
        </Box>
        {isLoading ? (
          <strong>Loading ..</strong>
        ) : filteredStudents.length ? (
          <StudentList
            students={filteredStudents}
            toggleStudentCollapse={toggleStudentCollapse}
            deleteStudent={deleteStudent}
            updateStudent={updateStudent}
          />
        ) : (
          <strong>No students to show</strong>
        )}
      </Container>
      <AlertsView
        alerts={alerts}
        closeAlert={(alertIndex) => closeAlert(alertIndex)}
      />
    </Box>
  )

  async function addStudent(newStudent: NewStudentInfo) {
    const response = await apiService<{ uuid: string }>(() =>
      services.addStudent(newStudent)
    )

    if ("error" in response) {
      return setAlerts(toAlertsObjects(response.messages))
    }

    setStudents([
      ...students,
      {
        ...newStudent,
        uuid: response.uuid,
        dob: new Date(newStudent.dob).toLocaleDateString(),
        collapsed: false,
      },
    ])
    setAlerts([
      { type: "success", message: "A new student have been added", open: true },
    ])
  }

  async function deleteStudent(uuid: string) {
    const response = await apiService<void>(() => services.deleteStudent(uuid))

    if (response) {
      return setAlerts(toAlertsObjects(response.messages))
    }

    setStudents(students.filter((student) => student.uuid !== uuid))
  }

  async function updateStudent(uuid: string, newStudentInfo: NewStudentInfo) {
    const response = await apiService<void>(() =>
      services.updateStudent(uuid, newStudentInfo)
    )

    if (response) {
      return setAlerts(toAlertsObjects(response.messages))
    }

    Object.assign(
      students.find((student) => student.uuid === uuid),
      { newStudentInfo, dob: new Date(newStudentInfo.dob).toLocaleDateString() }
    )
    setStudents([...students])
    return true
  }

  function toggleStudentCollapse(uuid: string) {
    const student = students.find((student) => student.uuid === uuid) as Student

    student.collapsed = !student.collapsed
    setStudents([...students])
  }

  function closeAlert(alertIndex: number) {
    alerts[alertIndex].open = false
    setAlerts([...alerts])
  }
}

function stopPropagation(e: SyntheticEvent, cb?: () => void) {
  e.stopPropagation()
  if (cb) {
    cb()
  }
}

function formatToValidDate(date: string) {
  const dateObject = new Date(date)
  return `${String(dateObject.getFullYear()).padStart(4, "0")}-${String(
    dateObject.getMonth() + 1
  ).padStart(2, "0")}-${String(dateObject.getDate()).padStart(2, "0")}`
}

function toAlertsObjects(messages: string[]) {
  return messages.map<AlertDetails>((message) => ({
    type: "error",
    message,
    open: true,
  }))
}
