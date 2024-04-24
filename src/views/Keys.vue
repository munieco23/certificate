<template>
  <Navbar v-model:userData="userData" v-model:isLoading="isLoading"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Generate Private Key</h1>
      <div class="p-0 flex flex-column gap-3">
        <InputText class="w-full" v-model="publicKey" placeholder="Public key: xxxxxxxxxx" :disabled="!isGenerated"
          </InputText>
          <InputText class="w-full" v-model="privateKey" placeholder="Private key: xxxxxxxxxx" :disabled="!isGenerated"
            </InputText>

            <div class="footer-container flex gap-2">
              <Button label="Reset" severity="secondary" class="w-20rem m-auto p-button" @click="reload()"></Button>
              <Button label="Generate" class="w-20rem m-auto p-button" :disabled="false" :isLoading="isLoading"
                @click="useGenerateKeys()" />
            </div>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="layoutToast" />
</template>

<script setup>
import Toast from 'primevue/toast'
import { ref } from 'vue'
import Button from 'primevue/button'
import Navbar from '../components/NavBar.vue'
import { generateKeys } from '../utils/pki.js'
import { useToast } from 'primevue/usetoast'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'

const toast = useToast()
const isLoading = ref(false)
const privateKey = ref(null)
const publicKey = ref(null)
const userData = ref({
  username: '',
  password: ''
})

const isGenerated = ref(false);

const useGenerateKeys = async () => {
  isLoading.value = true
  try {
    const res = await generateKeys()
    isLoading.value = false
    isGenerated.value = true
    privateKey.value = res.privateKey
    publicKey.value = res.publicKey
    console.log(res)
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
