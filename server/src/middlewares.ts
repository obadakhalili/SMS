import { Request, Response, NextFunction } from "express"
import { Schema, ValidationError } from "joi"

function error(
  details: { error: Error; status: number; messages: string[] },
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.DEBUG === "true") {
    console.log(details.error)
  }
  res.status(details.status).json(details.messages)
}

function validateSchema(schema: Schema) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await schema.validateAsync(req.body, { abortEarly: false })
      next()
    } catch (error) {
      next({
        error,
        status: 400,
        messages: (error as ValidationError).details.map(
          (detail) => detail.message
        ),
      })
    }
  }
}

export default { error, validateSchema }
