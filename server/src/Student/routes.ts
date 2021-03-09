import express from "express"
import controllers from "./controllers"
import middlewares from "../middlewares"
import schemas from "./schemas"

const router = express.Router()

router
  .route("/")
  .post(
    middlewares.validateSchema(schemas.userAddition),
    controllers.addStudent
  )
  .get(controllers.getAllStudents)

router
  .route("/:id")
  .patch(
    middlewares.validateSchema(schemas.userUpdation),
    controllers.updateStudent
  )
  .delete(controllers.deleteStudent)

export default router
