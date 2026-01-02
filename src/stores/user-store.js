import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isAdmin: false,
    isAuthenticated: false,
  }),
  actions: {
    login(username, password) {
      if (username === 'admin' && password === 'admin123') {
        this.isAuthenticated = true
        this.isAdmin = true
        return true
      }
      return false
    },
    logout() {
      this.isAuthenticated = false
      this.isAdmin = false
    }
  }
})
