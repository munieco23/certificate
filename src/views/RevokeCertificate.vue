<template>
  <Navbar v-model:userData="userData" v-model:isLoading="isLoading"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Revoke Certificate</h1>
      <form @submit.prevent="createCertificate">
        <div class="p-0 flex flex-column gap-3">
          <InputText class="w-full" v-model="serial" placeholder="Serial number"></InputText>
          <div class="footer-container flex gap-2">
            <Button label="Reset" severity="secondary" class="w-20rem m-auto p-button" @click="reload()"></Button>
            <Button type="submit" label="Revoke" class="w-20rem m-auto p-button" :disabled="false"
              :isLoading="isLoading" />
          </div>
        </div>
      </form>
    </div>
  </div>
  <Toast position="bottom-right" group="layoutToast" />
</template>

<script setup>
import Toast from 'primevue/toast'
import { ref, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import Navbar from '../components/NavBar.vue'
import { useToast } from 'primevue/usetoast'
import { getCertificationAuthorities, baseEndpoint } from '../services/certificates.js'
import InputText from 'primevue/inputtext'

const toast = useToast()
const isLoading = ref(false)
const _data = ref([])
const authOptions = ref([])
const authority = ref()
const serial = ref('')

const userData = ref({
  username: '',
  password: ''
})

watch(_data, (v) => {
  if (v) {
    authOptions.value = v.map((t) => {
      return { id: t.name, name: t.name }
    })
  }
})

watch(authOptions, (v) => {
  if (v.length > 0) {
    authority.value = authOptions.value[0]?.id
  }
})


const useGetCertAuthorities = async () => {
  isLoading.value = true
  const res = await getCertificationAuthorities(userData.value)
  if (res.certificationAuthorities) {
    isLoading.value = false
    _data.value = res.certificationAuthorities
  }
}

const createCertificate = async () => {
  isLoading.value = true
  const basicAuth = 'Basic ' + btoa(userData.value.username + ':' + userData.value.password)
  const url = `${baseEndpoint}/certificates/revoke/${authority.value}/${serial.value}`
  const myHeaders = new Headers()
  myHeaders.append('Authorization', basicAuth)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  }

  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      isLoading.value = false
      if (result.success) {
        toast.add({
          group: 'layoutToast',
          severity: 'success',
          summary: `Great`,
          detail: result.message,
          life: 3000
        })
      } else {
        toast.add({
          group: 'layoutToast',
          severity: 'error',
          summary: `Error`,
          detail: result.message,
          life: 3000
        })
      }
    })
    .catch((error) => {
      console.error(error)
      isLoading.value = false
      toast.add({
        group: 'layoutToast',
        severity: 'error',
        summary: error.code,
        detail: error.message,
        life: 3000
      })
    })
}


const reload = async () => {
  location.reload()
}

onMounted(() => {
  useGetCertAuthorities()
})
</script>
