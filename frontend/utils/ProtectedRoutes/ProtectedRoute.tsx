"use client"

import { supabase } from "@/lib/supabse"

export const protectRoute = async (
  router: any,
  allowedRole: string
) => {

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {

    localStorage.removeItem("login")

    router.replace("/")

    return
  }

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  const role = data?.role

  console.log("DATABASE ROLE:", role)

  
  if (role !== allowedRole) {

    router.replace("/")

    return
  }
}