import { defineStore } from 'pinia'
import { supabase } from 'src/supabase'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAdmin: false,
    isAuthenticated: false,
    currentUserRole: null,
    username: 'admin', 
    password: 'admin123',
    isLoaded: false
  }),
  actions: {
    async checkAuth() {
      // 1. Fetch live credentials from Supabase first
      await this.fetchCredentials()

      // 2. Check local session
      const auth = localStorage.getItem('is_authenticated')
      const role = localStorage.getItem('user_role')
      if (auth === 'true') {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = role
      }
    },

    async fetchCredentials() {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('key, value')
          .in('key', ['admin_username', 'admin_password'])
        
        if (error) throw error
        
        if (data) {
          data.forEach(item => {
            if (item.key === 'admin_username') this.username = item.value
            if (item.key === 'admin_password') this.password = item.value
          })
        }
        this.isLoaded = true
        return true
      } catch (err) {
        console.error('Error fetching credentials:', err)
        return false
      }
    },

    async login(inputUsername, inputPassword) {
      // Re-fetch to be absolutely sure we have the latest (in case changed recently on another dev)
      await this.fetchCredentials()

      const isSuper = inputUsername === 'superadmin' && inputPassword === 'superadmin123'
      const isStandard = inputUsername === this.username && inputPassword === this.password
      
      if (isSuper || isStandard) {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = isSuper ? 'superadmin' : 'admin'
        
        // Persist session locally
        localStorage.setItem('is_authenticated', 'true')
        localStorage.setItem('user_role', this.currentUserRole)
        return true
      }
      return false
    },

    async logout() {
      this.isAuthenticated = false
      this.isAdmin = false
      this.currentUserRole = null
      
      // Clear session
      localStorage.removeItem('is_authenticated')
      localStorage.removeItem('user_role')
    },

    // Requires validation of current credentials to change them
    async updateCredentials(currentUsername, currentPassword, newUsername, newPassword) {
      if (!newUsername || !newPassword) return false

      const isSuperAuth = currentUsername === 'superadmin' && currentPassword === 'superadmin123'
      const isStandardAuth = currentUsername === this.username && currentPassword === this.password

      if (isSuperAuth || isStandardAuth) {
        if (isStandardAuth && newUsername === 'superadmin') return false 

        const success = await this._setStandardCredentials(newUsername, newPassword)
        return success
      }

      return false
    },

    async _setStandardCredentials(user, pass) {
      const { error } = await supabase
        .from('system_settings')
        .upsert([
          { key: 'admin_username', value: user },
          { key: 'admin_password', value: pass }
        ])

      if (error) {
        console.error('Error updating credentials in Supabase:', error)
        return false
      }

      this.username = user
      this.password = pass
      return true
    }
  }
})
