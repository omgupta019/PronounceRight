import { supabase } from "./supabase.js"

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    alert(error.message)
    return
  }

  // Create profile row
  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      username: username,
      xp: 0,
      level: 1,
      streak: 0,
    })
  }

  alert("Signup successful! Please check your email.")
}

export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    alert(error.message)
  }
}

export async function logout() {
  await supabase.auth.signOut()
}
