import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAdmin: false,
    isAuthenticated: false,
    username: localStorage.getItem('admin_username') || 'admin',
    password: localStorage.getItem('admin_password') || 'admin123'
  }),
  actions: {
    checkAuth() {
      const auth = localStorage.getItem('is_authenticated')
      const role = localStorage.getItem('user_role')
      if (auth === 'true') {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = role
      }
    },
    login(inputUsername, inputPassword) {
      const isSuper = inputUsername === 'superadmin' && inputPassword === 'superadmin123'
      const isStandard = inputUsername === this.username && inputPassword === this.password
      
      if (isSuper || isStandard) {
        this.isAuthenticated = true
        this.isAdmin = true
        this.currentUserRole = isSuper ? 'superadmin' : 'admin'
        
        // Persist session
        localStorage.setItem('is_authenticated', 'true')
        localStorage.setItem('user_role', this.currentUserRole)
        return true
      }
      return false
    },
    logout() {
      this.isAuthenticated = false
      this.isAdmin = false
      this.currentUserRole = null
      
      // Clear session
      localStorage.removeItem('is_authenticated')
      localStorage.removeItem('user_role')
    },
    // Requires validation of current credentials to change them
    updateCredentials(currentUsername, currentPassword, newUsername, newPassword) {
      if (!newUsername || !newPassword) return false

      const isSuperAuth = currentUsername === 'superadmin' && currentPassword === 'superadmin123'
      const isStandardAuth = currentUsername === this.username && currentPassword === this.password

      if (isSuperAuth) {
        // Superadmin is "Adding/Resetting" the standard user.
        // We do NOT update the superadmin credentials (they are unremovable/hardcoded).
        // We update the standard admin credentials.
        this._setStandardCredentials(newUsername, newPassword)
        return true
      }
      
      if (isStandardAuth) {
        // Standard admin updating themselves
        // Cannot change name to 'superadmin' to avoid conflict
        if (newUsername === 'superadmin') return false 
        this._setStandardCredentials(newUsername, newPassword)
        return true
      }

      return false
    },
    _setStandardCredentials(user, pass) {
      this.username = user
      this.password = pass
      localStorage.setItem('admin_username', user)
      localStorage.setItem('admin_password', pass)
    }
  }
})
