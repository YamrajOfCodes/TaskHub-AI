"use client"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { protectRoute } from "../../utils/ProtectedRoutes/ProtectedRoute"
import Tasks from "../components/Admin/Task"
import Submissions from "../components/Admin/Submission"
import { API } from "@/lib/supabse"
import { sendEmail } from "../../utils/sendEmail/sendEmail"


const taskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  image: yup
    .mixed<FileList>()
    .required("Product image is required")
    .test("fileSelected", "Product image is required", (value) => {
      return value instanceof FileList && value.length > 0
    })
    .test("fileSize", "Image must be under 5MB", (value) => {
      if (!(value instanceof FileList) || value.length === 0) return true
      return value[0].size <= 5 * 1024 * 1024
    })
    .test("fileType", "Only jpg, png, or webp allowed", (value) => {
      if (!(value instanceof FileList) || value.length === 0) return true
      return ["image/jpeg", "image/png", "image/webp"].includes(value[0].type)
    }),
})

type TaskFormData = yup.InferType<typeof taskSchema>

interface Task {
  id: string
  title: string
  description: string
  product_image_url: string
  status: string
  assigned_to: string
  feedback?: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Submission {
  id: string
  task_id: string
  image_url: string
  status: string
}

export default function AdminPage() {


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
  })

  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({})

  function logout() {
    localStorage.removeItem("login")
    router.push("/")
  }

 useEffect(() => {

  const checkAuth = async () => {

    await protectRoute(router, "user")
  }

  checkAuth()

}, [])

  useEffect(() => { fetchTasks(); fetchUsers(); fetchSubmissions() }, [])

  async function onSubmit(data: TaskFormData) {
    try {
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("image", data.image[0])

      await fetch(`${API}/tasks`, {
        method: "POST",
        body: formData,
      })

      reset()
      fetchTasks()
      alert("Task created")
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchTasks() {
    try {
      const res = await fetch(`${API}/tasks`)
      setTasks(await res.json())
    } catch (error) { console.log(error) }
  }

  async function fetchUsers() {
    try {
      const res = await fetch(`${API}/users`)
      setUsers(await res.json())
    } catch (error) { console.log(error) }
  }

  async function fetchSubmissions() {
    try {
      const res = await fetch(`${API}/submissions`)
      setSubmissions(await res.json())
    } catch (error) { console.log(error) }
  }


 async function assignTask(
  taskId: string,
  userId: string
) {

  try {

    const user = users.find(
      (u) => u.id === userId
    )

    await fetch(
      `${API}/assign-task/${taskId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          user_id: userId
        })
      }
    )

    // EMAIL
    if (user) {

      await sendEmail(
        user.name,
        `A new task has been assigned to you.`
      )
    }

    fetchTasks()

    alert("Task assigned")

  } catch (error) {

    console.log(error)
  }
}

async function acceptTask(
  taskId: string
) {

  try {

    const task = tasks.find(
      (t) => t.id === taskId
    )

    const user = users.find(
      (u) => u.id === task?.assigned_to
    )

    await fetch(
      `${API}/accept-task/${taskId}`,
      {
        method: "PUT"
      }
    )

    // EMAIL
    if (user) {

      await sendEmail(
        user.name,
        `Congratulations! Your task has been accepted.`
      )
    }

    fetchTasks()

    alert("Task accepted")

  } catch (error) {

    console.log(error)
  }
}

 async function addFeedback(
  taskId: string
) {

  try {

    const feedback = feedbacks[taskId]

    if (!feedback) {

      alert("Enter feedback")
      return
    }

    const task = tasks.find(
      (t) => t.id === taskId
    )

    const user = users.find(
      (u) => u.id === task?.assigned_to
    )

    await fetch(
      `${API}/add-feedback/${taskId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          feedback
        })
      }
    )

    // EMAIL
    if (user) {

      await sendEmail(
        user.name,
        `Revision requested: ${feedback}`
      )
    }

    setFeedbacks({
      ...feedbacks,
      [taskId]: ""
    })

    fetchTasks()

    alert("Feedback added")

  } catch (error) {

    console.log(error)
  }
}

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#f5f3ef", minHeight: "100vh" }}>

      {/* TOPBAR */}
      <div className="sticky top-0 z-10 bg-neutral-900 text-[#f5f3ef] flex items-center justify-between px-10 h-14 border-b-2 border-neutral-900">
        <span className="font-mono text-[13px] tracking-widest uppercase">Admin / Dashboard</span>
        <div className="flex items-center gap-5 font-mono text-xs text-neutral-400">
          <span>{tasks.length} tasks</span>
          <button
            onClick={logout}
            className="border border-neutral-600 text-[#f5f3ef] font-mono text-[11px] tracking-widest uppercase px-4 py-1.5 hover:bg-[#f5f3ef] hover:text-neutral-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-8 py-12 pb-20">

        {/* CREATE TASK */}
        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-neutral-900">
          <h2 className="text-[18px] font-semibold">New Task</h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-neutral-500">Create & assign</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-[#d6d2cb] p-8 mb-14">
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block font-mono text-[11px] tracking-widest uppercase text-neutral-500 mb-1.5">
                Title
              </label>
              <input
                type="text"
                placeholder="Task title"
                {...register("title")}
                className="w-full bg-[#f5f3ef] border border-[#d6d2cb] text-sm text-neutral-900 px-3 py-2.5 outline-none focus:border-neutral-900 transition-colors"
              />
              {errors.title && (
                <p className="font-mono text-[11px] text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block font-mono text-[11px] tracking-widest uppercase text-neutral-500 mb-1.5">
                Product Image
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                {...register("image")}
                className="w-full bg-[#f5f3ef] border border-[#d6d2cb] text-sm text-neutral-900 px-3 py-2.5 outline-none"
              />
              {errors.image && (
                <p className="font-mono text-[11px] text-red-600 mt-1">{errors.image.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block font-mono text-[11px] tracking-widest uppercase text-neutral-500 mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe what needs to be done..."
                {...register("description")}
                className="w-full bg-[#f5f3ef] border border-[#d6d2cb] text-sm text-neutral-900 px-3 py-2.5 outline-none focus:border-neutral-900 transition-colors resize-y min-h-[90px]"
              />
              {errors.description && (
                <p className="font-mono text-[11px] text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-neutral-900 text-[#f5f3ef] font-mono text-[12px] tracking-widest uppercase px-6 py-2.5 hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {isSubmitting ? "Creating..." : "Create Task"}
              </button>
            </div>

          </div>
        </form>

        {/* ALL TASKS */}
        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-neutral-900">
          <h2 className="text-[18px] font-semibold">All Tasks</h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-neutral-500">{tasks.length} tasks</span>
        </div>

        <div className="grid grid-cols-3 gap-px bg-[#d6d2cb] border border-[#d6d2cb] mb-14">
          {tasks.length === 0 && (
            <div className="col-span-3 bg-white text-center py-12 font-mono text-xs tracking-wider text-neutral-400 uppercase">
              No tasks yet
            </div>
          )}
          {tasks.map((task) => (
              <div key={task.id}>
              <Tasks task={task} users={users} assignTask={assignTask} />
              </div>
          ))}
        </div>

        {/* SUBMITTED WORK */}
        <div className="flex items-baseline gap-3 mb-6 pb-3 border-b-2 border-neutral-900">
          <h2 className="text-[18px] font-semibold">Submitted Work</h2>
          <span className="font-mono text-[11px] tracking-widest uppercase text-neutral-500">Review & respond</span>
        </div>

        <div className="grid grid-cols-3 gap-px bg-[#d6d2cb] border border-[#d6d2cb]">
          {submissions.length === 0 && (
            <div className="col-span-3 bg-white text-center py-12 font-mono text-xs tracking-wider text-neutral-400 uppercase">
              No submissions yet
            </div>
          )}
          {submissions.map((submission) => {
            const relatedTask = tasks.find((task) => task.id === submission.task_id)
            return (
              <div key={submission.id} className="bg-white p-5 flex flex-col gap-3">
               <Submissions
               acceptTask={acceptTask}
               addFeedback={addFeedback}
               feedbacks={feedbacks}
               relatedTask={relatedTask}
               submission={submission}
               setFeedbacks={setFeedbacks}
               />
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}