<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="fixed w-full h-full top-0 left-0 loading" v-if="isLoading">
    <ProgressSpinner></ProgressSpinner>
  </div>
  <div class="main flex justify-content-center">
    <div class="col-3">
      <h1 class="mb-3 text-center">Login</h1>
      <h3 class="mb-2 text-center">To work with this web app, please introduce the windows server credentials of Neptune
      </h3>
      <form @submit.prevent="signIn">
        <div class="p-0 flex flex-column gap-3">
          <InputText class="w-full" v-model="username" placeholder="username"></InputText>
          <div class="card flex justify-content-center">
            <Password class="w-full" v-model="password" placeholder="password" :feedback="false" toggleMask />
          </div>
          <div class="footer-container flex gap-2">
            <Button label="Sign in" class="w-20rem m-auto p-button" :disabled="isLoading" :isLoading="isLoading"
              type="submit"></Button>
          </div>
        </div>
      </form>
    </div>
  </div>
  <Toast position="bottom-right" group="layoutToast" />
</template>

<script setup>
import Toast from 'primevue/toast'
import { ref } from 'vue'
import Button from 'primevue/button'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import { useToast } from 'primevue/usetoast'
import { useSessionStore } from '../stores/session'
import { useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import { storeToRefs } from 'pinia'

const toast = useToast()
const isLoading = ref(false)
const username = ref('')
const password = ref('')

const router = useRouter()

const signIn = async () => {
  const { stored: sessionStore } = storeToRefs(useSessionStore())

  isLoading.value = true
  if (username.value && password.value) {
    sessionStore.value.username = username.value
    sessionStore.value.password = password.value

    setTimeout(() => {
      router.push('/home')
    }, 500)
  } else {
    isLoading.value = false
    toast.add({
      group: 'layoutToast',
      severity: 'error',
      summary: 'Error',
      detail: 'User or Password missing',
      life: 3000
    })
  }
}
</script>
