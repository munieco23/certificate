<template>
  <Navbar v-model:userData="userData" v-model:isLoading="isLoading"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Create CSR</h1>
      <form @submit.prevent="createCertificate">
        <div class="p-0 flex flex-column gap-3">
          <InputText class="w-full" v-model="subjectName" placeholder="Subject name"></InputText>
          <InputText class="w-full" v-model="email" placeholder="Email or user"></InputText>
          <InputText class="w-full" v-model="domain" placeholder="Domain:"></InputText>
          <InputText class="w-full" v-model="certName" placeholder="(Optional) CRS name"></InputText>
          <div class="footer-container flex gap-2">
            <Button label="Reset" severity="secondary" class="w-20rem m-auto p-button" @click="reload()"></Button>
            <Button type="submit" label="Generate" class="w-20rem m-auto p-button" :disabled="false"
              :isLoading="isLoading" />
          </div>
          <Textarea v-if="privateKey" class="w-full mb-2" v-model="privateKey" rows="5" cols="30"
            placeholder="paste code here"></Textarea>
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
import { useCertificateRequest } from '../utils/pki.js'
import { useToast } from 'primevue/usetoast'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'

const toast = useToast()
const isLoading = ref(false)
const certName = ref('')
const subjectName = ref('')
const domain = ref('')
const email = ref('')

const userData = ref({
  username: '',
  password: ''
})

const createCertificate = async () => {
  isLoading.value = true
  try {
    const res = await useCertificateRequest(subjectName.value, email.value, domain.value)
    const blob = new Blob([res], { type: 'application/x-x509-ca-cert' })
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create an anchor element to trigger the download
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download =
      certName.value.length > 0 ? `${certName.value}.csr` : 'newCertificateToSign.csr' // Specify the filename
    anchor.style.display = 'none'

    // Append the anchor to the body and trigger the download
    document.body.appendChild(anchor)
    anchor.click()

    // Cleanup: remove the anchor and revoke the URL
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    isLoading.value = false

    toast.add({
      group: 'layoutToast',
      severity: 'success',
      summary: `Great`,
      detail: `Private Key generated`,
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
