import { defineStore } from 'pinia'
import { supabase, supabaseUrl, supabaseKey } from 'src/supabase'
import { createClient } from '@supabase/supabase-js'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAdmin: false,
    isAuthenticated: false,
    currentUserRole: null,
    userEmail: null,
    isLoaded: false
  }),
  actions: {
    async checkAuth() {
      // 1. Listen for Auth State Changes
      supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          this.isAuthenticated = true
          this.isAdmin = true
          this.currentUserRole = 'admin'
          this.userEmail = session.user.email
          localStorage.setItem('is_authenticated', 'true')
          localStorage.setItem('user_role', 'admin')
        } else if (localStorage.getItem('user_role') !== 'superadmin') {
          // Only clear if not superadmin (since superadmin doesn't have a supabase session)
          this.isAuthenticated = false
          this.isAdmin = false
          this.currentUserRole = null
          this.userEmail = null
        }
      })

      // 2. Initial Session Check
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = 'admin'
        this.userEmail = session.user.email
      } else {
        // Fallback check for local superadmin session (persisted in localStorage)
        const role = localStorage.getItem('user_role')
        const isAuth = localStorage.getItem('is_authenticated')
        if (isAuth === 'true' && role === 'superadmin') {
          this.isAuthenticated = true
          this.isAdmin = true
          this.currentUserRole = 'superadmin'
        }
      }
      this.isLoaded = true
    },

    async login(emailOrUsername, password) {
      // 1. Hardcoded Superadmin Bypass
      if (emailOrUsername === 'superadmin' && password === 'superadmin123') {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = 'superadmin'
        localStorage.setItem('is_authenticated', 'true')
        localStorage.setItem('user_role', 'superadmin')
        return { success: true }
      }

      // 2. Standard Admin via Supabase Auth (Email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password: password
      })

      if (error) {
        console.error('Login error:', error.message)
        return { success: false, error: error.message }
      }

      if (data.session) {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = 'admin'
        this.userEmail = data.user.email
        // Persistent session is handled by Supabase client automatically,
        // but we'll set these for compatibility with existing route guards if any.
        localStorage.setItem('is_authenticated', 'true')
        localStorage.setItem('user_role', 'admin')
        return { success: true }
      }

      return { success: false, error: 'Unknown login error' }
    },

    async logout() {
      await supabase.auth.signOut()
      this.isAuthenticated = false
      this.isAdmin = false
      this.currentUserRole = null
      this.userEmail = null
      
      localStorage.removeItem('is_authenticated')
      localStorage.removeItem('user_role')
    },

    async updateCredentials(currentPassword, newEmail, newPassword) {
      // 1. Optional: Verify current password first if provided
      if (currentPassword) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: this.userEmail,
          password: currentPassword
        })
        if (loginError) {
          return { success: false, error: 'Current password incorrect' }
        }
      }

      // 2. Update currently logged in Supabase user
      const updates = {}
      if (newEmail) updates.email = newEmail
      if (newPassword) updates.password = newPassword

      const { error } = await supabase.auth.updateUser(updates)

      if (error) {
        console.error('Update credentials error:', error.message)
        return { success: false, error: error.message }
      }

      if (newEmail) this.userEmail = newEmail
      return { success: true }
    },

    async registerAdmin(email, password) {
      // Create a temporary client that doesn't persist session to avoid logging out the current user
      const tempSupabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      })

      const { data, error } = await tempSupabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        console.error('Registration error:', error.message)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    }
  }
})
