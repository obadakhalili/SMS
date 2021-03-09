import { Request, Response, NextFunction, query } from "express"
import { v4 as uuidv4 } from "uuid"
import db from "../db"

async function getAllStudents(req: Request, res: Response, next: NextFunction) {
  try {
    const { rows: students } = await db.query("SELECT * FROM student")
    res.json(students)
  } catch (error) {
    next({
      error,
      status: 500,
      messages: ["Internal Server Error"],
    })
  }
}

async function addStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, dob, gpa } = req.body as {
      name: string
      dob: string
      gpa: number
    }
    await db.query("INSERT INTO student VALUES ($1, $2, $3, $4)", [
      uuidv4(),
      name,
      dob,
      gpa,
    ])
    res.end()
  } catch (error) {
    next({
      error,
      status: 500,
      messages: ["Internal Server Error"],
    })
  }
}

async function updateStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const composedUpdationString = Object.entries(req.body)
      .filter(([_, value]) => value)
      .map(
        ([key, value]) =>
          `${key} = ${typeof value === "number" ? value : `'${value}'`}`
      )
      .join(", ")

    if (composedUpdationString) {
      await db.query(
        `UPDATE student SET ${composedUpdationString} WHERE uuid = '${req.params.id}'`
      )
    }

    res.end()
  } catch (error) {
    next({
      error,
      status: 500,
      messages: ["Internal Server Error"],
    })
  }
}

async function deleteStudent(req: Request, res: Response, next: NextFunction) {
  try {
    await db.query("DELETE FROM student WHERE uuid = $1", [req.params.id])
    res.end()
  } catch (error) {
    next({
      error,
      status: 500,
      messages: ["Internal Server Error"],
    })
  }
}

export default {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
}
