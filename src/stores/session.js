import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const defaultData = {
  username: null,
  password: null
}

export const useSessionStore = defineStore('certSession', {
  state: () => {
    return {
      stored: useStorage('usrCert', defaultData, localStorage, {
        mergeDefaults: true
      })
    }
  },
  getters: {},
  actions: {}
})
