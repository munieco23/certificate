<template>
  <Navbar v-model:userData="userData" v-model:isLoading="isLoading"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Generate Private Key</h1>
      <div class="p-0 flex flex-column gap-3">
        <div class="footer-container flex gap-2">
          <Button
            label="Reset"
            severity="secondary"
            class="w-20rem m-auto p-button"
            @click="reload()"
          ></Button>
          <Button
            label="Generate"
            class="w-20rem m-auto p-button"
            :disabled="false"
            :isLoading="isLoading"
            @click="useGeneratePrivateKey()"
          />
        </div>
        <Textarea
          v-if="privateKey"
          class="w-full mb-2"
          v-model="privateKey"
          rows="5"
          cols="30"
          placeholder="paste code here"
        ></Textarea>
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
import { generatePrivateKey } from '../utils/pki.js'
import { useToast } from 'primevue/usetoast'
import Textarea from 'primevue/textarea'

const toast = useToast()
const isLoading = ref(false)
const privateKey = ref(null)
const userData = ref({
  username: '',
  password: ''
})

const useGeneratePrivateKey = async () => {
  isLoading.value = true
  try {
    const res = await generatePrivateKey()
    isLoading.value = false
    privateKey.value = res
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
