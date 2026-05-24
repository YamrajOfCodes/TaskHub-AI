"use client"

import { use, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { useRouter } from "next/navigation"
import { API } from "@/lib/supabse"
import { protectRoute } from "@/utils/ProtectedRoutes/ProtectedRoute"

interface DecodedToken {
  sub: string
  role: string
}

export default function TaskPage({
  params
}: {
  params: Promise<{
    id: string
  }>
}) {

  const { id } = use(params)

  const router = useRouter()

  const [task, setTask] = useState<any>(null)

  const [generatedImage, setGeneratedImage] = useState("")

  const [loading, setLoading] = useState(false)

  // ---------------- LOGOUT ----------------
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

  // ---------------- GENERATE IMAGE ----------------
  async function generateImage(prompt: string) {

    try {

      setLoading(true)

      const res = await fetch(
        `${API}/generate-image`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            image_url: task.product_image_url,
            prompt
          })
        }
      )

      const data = await res.json()

      setGeneratedImage(data.image)

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)
    }
  }

  // ---------------- SUBMIT WORK ----------------
  async function submitWork() {

    try {

      const token = localStorage.getItem("login")

      if (!token) {

        alert("Please login first")
        return
      }

      const decoded = jwtDecode<DecodedToken>(token)

      const userId = decoded.sub

      if (!userId) {

        alert("User ID not found")
        return
      }

      const res = await fetch(
        `${API}/submit-task`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            task_id: task.id,
            user_id: userId,
            image_url: generatedImage
          })
        }
      )

      const data = await res.json()

      alert(data.message)

    } catch (err) {

      console.log(err)
    }
  }

  // ---------------- FETCH TASK ----------------
  async function fetchTask() {

    try {

      const res = await fetch(
        `${API}/task/${id}`
      )

      const data = await res.json()

      setTask(data)

    } catch (err) {

      console.log(err)
    }
  }

  useEffect(() => {

    fetchTask()

  }, [])

  // ---------------- LOADING ----------------
  if (!task) {

    return (
      <p className="p-10">
        Loading...
      </p>
    )
  }

  return (

    <div className="p-10 min-h-screen bg-gray-100">

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-bold">
          {task.title}
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      <img
        src={
          task.product_image_url?.startsWith("http")
            ? task.product_image_url
            : `${API}/${task.product_image_url}`
        }
        alt="product"
        className="w-72 rounded-lg mb-6"
      />

      <p className="mb-8">
        {task.description}
      </p>

      {/* IMAGE GENERATION BUTTONS */}
      <div className="grid grid-cols-2 gap-4">

        <button
          className="bg-black text-white p-4 rounded"
          onClick={() =>
            generateImage(
              "Luxury jewelry photography on white background, DSLR quality"
            )
          }
        >
          White Background
        </button>

        <button
          className="bg-black text-white p-4 rounded"
          onClick={() =>
            generateImage(
              "Luxury jewelry photography on luxury theme, DSLR quality"
            )
          }
        >
          Luxury Theme
        </button>

        <button
          className="bg-black text-white p-4 rounded"
          onClick={() =>
            generateImage(
              "Creative jewelry ad photography, cinematic lighting"
            )
          }
        >
          Creative Theme
        </button>

        <button
          className="bg-black text-white p-4 rounded"
          onClick={() =>
            generateImage(
              "Fashion model wearing luxury jewelry, studio shoot"
            )
          }
        >
          Model Wearing
        </button>

      </div>

      {/* LOADING */}
      {loading && (

        <p className="mt-6">
          Generating image...
        </p>
      )}

      {/* GENERATED IMAGE */}
      {generatedImage && (

        <div className="mt-10">

          <p className="mb-4 font-bold">
            Generated Result
          </p>

          <img
            src={generatedImage}
            alt="generated"
            className="w-72 rounded-lg border"
            referrerPolicy="no-referrer"
          />

          <button
            onClick={submitWork}
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded"
          >
            Submit Work
          </button>

        </div>

      )}

    </div>
  )
}