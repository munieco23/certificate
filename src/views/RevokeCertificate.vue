<template>
  <Navbar v-model:userData="userData" v-model:isLoading="isLoading"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Revoke Certificate</h1>
      <form @submit.prevent="createCertificate">
        <div class="p-0 flex flex-column gap-3">
          <InputText class="w-full" v-model="serial" placeholder="Serial number"></InputText>
          <InputText class="w-full" v-model="connection" placeholder="Connection"></InputText>
          <div class="footer-container flex gap-2">
            <Button
              label="Reset"
              severity="secondary"
              class="w-20rem m-auto p-button"
              @click="reload()"
            ></Button>
            <Button
              type="submit"
              label="Revoke"
              class="w-20rem m-auto p-button"
              :disabled="false"
              :isLoading="isLoading"
            />
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
import Navbar from '../components/NavBar.vue'
import { useToast } from 'primevue/usetoast'
import { revokeCertificate } from '../services/certificates.js'
import InputText from 'primevue/inputtext'

const toast = useToast()
const isLoading = ref(false)
const serial = ref('')
const connection = ref('')

const userData = ref({
  username: '',
  password: ''
})

const createCertificate = async () => {
  isLoading.value = true
  try {
    const res = await revokeCertificate(userData.value, serial.value, connection.value)
    console.log(res)

    toast.add({
      group: 'layoutToast',
      severity: 'success',
      summary: `Great`,
      detail: `Certificate revoked`,
      life: 3000
    })
  } catch (err) {
    isLoading.value = false
    console.log(err)
    toast.add({
      group: 'layoutToast',
      severity: 'error',
      summary: err.code,
      detail: err.message,
      life: 3000
    })
  }
}

const reload = async () => {
  location.reload()
}
</script>
