import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: JSON.parse(localStorage.getItem('role')) || null,
    token: JSON.parse(localStorage.getItem('token')) || null,
  }),
  actions: {
    setRole(role) {
      this.role = role
      localStorage.setItem('role', JSON.stringify(role)) // Save to local storage
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('token', JSON.stringify(token)) // Save to local storage
    },
    clearAuth() {
      this.role = null
      this.token = null
      localStorage.removeItem('role')
      localStorage.removeItem('token')
    },
    async login(email, password) {
      try {
        const response = await fetch('http://localhost:8080/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })

        const data = await response.json()
        console.log(data)

        this.setRole(data.role)
        this.setToken(data.token)

        return response
      } catch (error) {
        console.error('Login error:', error)
      }
    },
    logout() {
      this.clearAuth()
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === 'admin',
  },
})
