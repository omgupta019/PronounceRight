

const { createClient } = window.supabase

const supabaseUrl = "https://sdnbapmkvqjouzgdvflb.supabase.co"
const supabaseAnonKey = "sb_publishable_5FGlvn3tkkX_PnccZH-TEg_hSS1BLWC"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log("REAL SUPABASE FILE IS LOADED");
