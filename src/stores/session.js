import { defineStore } from 'pinia'

export const useSessionStore = defineStore('certSession', {
  state: () => ({ username: null, password: null }),
  actions: {
    setUserData(user, pass) {
      this.username = user
      this.password = pass
    }
  }
})
