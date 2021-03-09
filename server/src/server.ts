import express from "express"
import studentAPI from "./Student/routes"
import middlewares from "./middlewares"

express()
  .use(express.json())
  .use("/api", studentAPI)
  .use(middlewares.error)
  .listen(process.env.PORT, () => console.log("Server is up and running"))
