"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { API, supabase } from "@/lib/supabse"

interface Task {
  id: string
  title: string
  description: string
  product_image_url: string
  status: string
  feedback?: string
}

export default function DashboardPage() {
  const router = useRouter()

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          router.replace("/")
          return
        }

        const user = session.user
        const res = await fetch(`${API}/my-tasks/${user.id}`)
        const data = await res.json()

        setTasks(data || [])
      } catch (error) {
        console.log("Dashboard error:", error)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    setTasks([])
    router.replace("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white shadow-sm px-10 py-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Dashboard</h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="p-10">

        {tasks.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-2xl font-semibold mb-2">
              No Tasks Assigned
            </h2>
            <p className="text-gray-500">
              Waiting for admin to assign tasks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >

                <img
                  src={task.product_image_url}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">

                  <div className="flex justify-between mb-3">

                    <h2 className="text-xl font-bold">
                      {task.title}
                    </h2>

                    <span
                      className={`text-sm px-3 py-1 rounded-full text-white
                        ${task.status === "pending"
                          ? "bg-gray-500"
                          : task.status === "assigned"
                          ? "bg-blue-500"
                          : task.status === "submitted"
                          ? "bg-yellow-500"
                          : task.status === "accepted"
                          ? "bg-green-600"
                          : "bg-red-500"
                        }
                      `}
                    >
                      {task.status.replace("_", " ")}
                    </span>

                  </div>

                  <p className="text-gray-600 mb-5">
                    {task.description}
                  </p>

                  {/* FEEDBACK */}
                  {task.feedback && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-5">
                      <p className="font-semibold text-red-600 mb-1">
                        Admin Feedback
                      </p>
                      <p className="text-sm text-gray-700">
                        {task.feedback}
                      </p>
                    </div>
                  )}

                  <Link
                    href={`/task/${task.id}`}
                    className="inline-block bg-black text-white px-5 py-3 rounded-lg"
                  >
                    Open Task
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}