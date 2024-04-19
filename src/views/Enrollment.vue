<template>
  <Navbar v-model:userData="userData" v-model:isLoading="isLoading"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Enrollment</h1>
      <div class="p-0 flex flex-column gap-3">
        <div class="flex align-items-center">
          <div class="col-4">
            <label>Select Template:</label>
          </div>
          <div class="col-8">
            <Dropdown class="w-full" v-model="template" :options="tempOptions" optionLabel="name" optionId="id"
              placeholder="Select an option"></Dropdown>
          </div>
        </div>
        <Textarea class="w-full mb-2" v-model="certificateText" rows="5" cols="30" placeholder="paste code here" />
        <InputText class="w-full" v-model="certName" placeholder="(Optional) Certificate name"></InputText>
        <div class="footer-container flex gap-2">
          <Button label="Reset" severity="secondary" class="w-20rem m-auto p-button" @click="reload()"></Button>
          <Button label="Request certificate" severity="primary" class="w-20rem m-auto p-button"
            @click="requestCertificate()" :loading="isLoading" :disabled="allowSave"></Button>
        </div>
      </div>
    </div>
  </div>
  <Toast position="bottom-right" group="layoutToast" />
</template>

<script setup>
import Toast from 'primevue/toast'
import { ref, watch, computed, onMounted } from 'vue'
import { nextTick } from 'vue'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { getCertificationAuthorities, certificateSignRequest } from '../services/certificates.js'
import Navbar from '../components/NavBar.vue'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const authOptions = ref([])
const tempOptions = ref([])
const isLoading = ref(false)
const authority = ref()
const template = ref(null)
const certificateText = ref(null)
const certName = ref('')
const _data = ref([])
const userData = ref()

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

watch(authority, (v) => {
  if (v) {
    const templates = _data.value?.find((t) => t.name == v).certificateTemplates
    tempOptions.value = templates.map((t) => {
      return { id: t, name: t }
    })
  }
})

const useGetCertAuthorities = async () => {
  const res = await getCertificationAuthorities(userData.value)
  if (res.certificationAuthorities) {
    _data.value = res.certificationAuthorities
  }
}

const allowSave = computed(() => {
  return !certificateText.value || !template.value
})

const requestCertificate = async () => {
  isLoading.value = true

  const catName = authority.value
  const templateSelected = template.value?.id

  const dataString = {
    request: certificateText.value,
    requestAttributes: []
  }
  try {
    isLoading.value = false
    const res = await certificateSignRequest(userData.value, catName, templateSelected, dataString)
    const blob = new Blob([res.certificate], { type: 'application/x-x509-ca-cert' })
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create an anchor element to trigger the download
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download =
      certName.value.length > 0 ? `${certName.value}.cer` : 'newCertificateSigned.cer' // Specify the filename
    anchor.style.display = 'none'

    // Append the anchor to the body and trigger the download
    document.body.appendChild(anchor)
    anchor.click()

    // Cleanup: remove the anchor and revoke the URL
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.add({
      group: 'layoutToast',
      severity: 'success',
      summary: `Great`,
      detail: `Certification signed successful`,
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

onMounted(() => {
  useGetCertAuthorities()
})
</script>
