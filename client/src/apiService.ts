import { NewStudentInfo } from "./SMS"

async function getStudents() {
  return await fetch("/api")
}

async function addStudent(newStudent: NewStudentInfo) {
  return await fetch("/api", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent),
  })
}

async function updateStudent(uuid: string, body: NewStudentInfo) {
  return await fetch("/api/" + uuid, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

async function deleteStudent(uuid: string) {
  return await fetch("/api/" + uuid, { method: "DELETE" })
}

export const services = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
}

export default async function apiService<T>(
  service: () => Promise<Response>
): Promise<T | { error: true; messages: string[] }> {
  const response = await service()

  try {
    let body = await response.json()

    if (response.ok) {
      return body as T
    }

    return {
      error: true,
      messages: body,
    }
  } catch {
    return (undefined as unknown) as T
  }
}
