"use client"

import { supabase } from "@/lib/supabse"

export const protectRoute = async (
  router: any,
  allowedRole: string
) => {

  // ✅ WAIT for session properly
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.log("Session error:", error)
    router.replace("/")
    return
  }

  // 🔥 IMPORTANT: DO NOT redirect immediately if null (production lag fix)
  if (!session) {
    setTimeout(() => {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          router.replace("/")
        }
      })
    }, 500)

    return
  }

  const user = session.user

  const { data: roleData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (roleError) {
    console.log("Role error:", roleError)
    return
  }

  const role = roleData?.role

  if (!role) return

  if (role !== allowedRole) {
    router.replace("/")
    return
  }
}