"use client"

import { useState } from "react"
import { supabase } from "../lib/supabse"
import { jwtDecode } from "jwt-decode"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

async function handleLogin() {

  try {

    const res = await fetch(
      "http://127.0.0.1:5000/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    )

    const data = await res.json()

    console.log(data)

  
    if (data.token) {

    
      localStorage.setItem(
        "login",
        data.token
      )


      const decodedData: any =
        jwtDecode(data.token)

      const role =
        decodedData.role ||
        decodedData.user_metadata?.role ||
        "user"

      if (role === "admin") {

        window.location.href = "/Admin"

      } else {

        window.location.href = "/Dashboard"
      }

    } else {

      alert(data.error || "Login failed")
    }

  } catch (err) {

    console.log(err)

    alert("Something went wrong")
  }
}

  // ---------------- GOOGLE LOGIN ----------------
  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback"
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="border bg-white p-10 rounded-lg w-[400px] shadow-lg">

        <h1 className="text-3xl font-bold mb-8 text-center">
          TaskHub Login
        </h1>

        <button
          onClick={loginWithGoogle}
          className="w-full bg-black text-white p-3 rounded mb-4"
        >
          Continue with Google
        </button>


        <div className="text-center text-gray-400 mb-6">
          OR
        </div>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full border p-3 rounded mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full border p-3 rounded mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>

      </div>
    </div>
  )
}