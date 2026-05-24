"use client"

import { supabase } from "@/lib/supabse"

export const protectRoute = async (
  router: any,
  allowedRole: string
) => {
  try {
    const { data: { session } } = await supabase.auth.getSession()

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

    if (error) {
      console.log("Role fetch error:", error)
      router.replace("/")
      return
    }

    const role = roleData?.role

    console.log("DATABASE ROLE:", role)

    if (!role) return

    if (role !== allowedRole) {
      router.replace("/")
      return
    }

  } catch (err) {
    console.log("Protect route error:", err)
    router.replace("/")
  }
}