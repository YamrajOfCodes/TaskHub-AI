"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import Tasks from "../components/Admin/Task"
import Submissions from "../components/Admin/Submission"

import { API, supabase } from "@/lib/supabse"
import { sendEmail } from "../../utils/sendEmail/sendEmail"

const taskSchema = yup.object({
  title: yup.string().required().min(3),
  description: yup.string().required().min(10),
  image: yup
    .mixed<FileList>()
    .required()
    .test("fileSelected", (v) => v instanceof FileList && v.length > 0),
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
  const router = useRouter()

  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: yupResolver(taskSchema),
  })

 useEffect(() => {
  let mounted = true

  const init = async () => {
    try {
    
      let { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        await new Promise((res) => setTimeout(res, 500))

        const retry = await supabase.auth.getSession()
        session = retry.data.session
      }

      if (!mounted) return

      if (!session) {
        router.replace("/")
        return
      }

      const user = session.user

      const { data: roleData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      if (error || !roleData) {
        console.log("ROLE ERROR:", error)
        router.replace("/")
        return
      }

      if (roleData.role !== "admin") {
        router.replace("/")
        return
      }

      await fetchTasks()
      await fetchUsers()
      await fetchSubmissions()

    } catch (err) {
      console.log("Admin init error:", err)
      router.replace("/")
    } finally {
      setLoading(false)
    }
  }

  init()

  return () => {
    mounted = false
  }
}, [])

 
  async function logout() {
    await supabase.auth.signOut()
    router.replace("/")
  }

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
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchTasks() {
    const res = await fetch(`${API}/tasks`)
    setTasks(await res.json())
  }

  async function fetchUsers() {
    const res = await fetch(`${API}/users`)
    setUsers(await res.json())
  }

  async function fetchSubmissions() {
    const res = await fetch(`${API}/submissions`)
    setSubmissions(await res.json())
  }

  async function assignTask(taskId: string, userId: string) {
    const user = users.find((u) => u.id === userId)

    await fetch(`${API}/assign-task/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })

    if (user) {
      await sendEmail(user.name, "A new task has been assigned to you.")
    }

    fetchTasks()
    alert("Task assigned")
  }


  async function acceptTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId)
    const user = users.find((u) => u.id === task?.assigned_to)

    await fetch(`${API}/accept-task/${taskId}`, { method: "PUT" })

    if (user) {
      await sendEmail(user.name, "Your task has been accepted.")
    }

    fetchTasks()
    alert("Task accepted")
  }

  async function addFeedback(taskId: string) {
    const feedback = feedbacks[taskId]

    if (!feedback) return alert("Enter feedback")

    const task = tasks.find((t) => t.id === taskId)
    const user = users.find((u) => u.id === task?.assigned_to)

    await fetch(`${API}/add-feedback/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    })

    if (user) {
      await sendEmail(user.name, `Revision requested: ${feedback}`)
    }

    setFeedbacks((prev) => ({ ...prev, [taskId]: "" }))

    fetchTasks()
    alert("Feedback added")
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#f5f3ef", minHeight: "100vh" }}>

      <div className="sticky top-0 z-10 bg-neutral-900 text-white flex justify-between px-10 h-14 items-center">
        <span>Admin Dashboard</span>

        <button
          onClick={logout}
          className="border px-4 py-1 text-xs"
        >
          Logout
        </button>
      </div>

      <div className="max-w-[1180px] mx-auto px-8 py-12">

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 mb-10">
          <input placeholder="Title" {...register("title")} />
          <textarea placeholder="Description" {...register("description")} />
          <input type="file" {...register("image")} />

          <button disabled={isSubmitting}>
            Create Task
          </button>
        </form>

        {/* TASKS */}
        <div>
          {tasks.map((task) => (
            <Tasks
              key={task.id}
              task={task}
              users={users}
              assignTask={assignTask}
            />
          ))}
        </div>

        {/* SUBMISSIONS */}
        <div>
          {submissions.map((submission) => {
            const relatedTask = tasks.find(t => t.id === submission.task_id)

            return (
              <Submissions
                key={submission.id}
                submission={submission}
                relatedTask={relatedTask}
                acceptTask={acceptTask}
                addFeedback={addFeedback}
                feedbacks={feedbacks}
                setFeedbacks={setFeedbacks}
              />
            )
          })}
        </div>

      </div>
    </div>
  )
}