import React from "react"
import ReactDOM from "react-dom"
import { positions, transitions, Provider as AlertProvider } from "react-alert"
import AlertTemplate from "react-alert-template-basic"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import SMS from "./SMS"

const alertOptions = {
  position: positions.BOTTOM_CENTER,
  transition: transitions.FADE,
  timeout: 3500,
}

ReactDOM.render(
  // <React.StrictMode>
  <AlertProvider template={AlertTemplate} {...alertOptions}>
    <SMS />
  </AlertProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
)
