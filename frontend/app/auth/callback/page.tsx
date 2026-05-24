"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabse"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const syncUser = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/")
        return
      }

      const user = session.user
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()


      if (!existingUser) {
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
          role: "user"
        })
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single()

      const role = userData?.role

      console.log("USER ROLE:", role)

      if (role === "admin") {
        router.replace("/Admin")
      } else {
        router.replace("/Dashboard")
      }
    }

    syncUser()
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Logging you in...</p>
    </div>
  )
}