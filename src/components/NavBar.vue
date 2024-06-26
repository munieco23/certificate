<template>
  <div class="fixed w-full h-full top-0 left-0 loading" v-if="vIsLoading">
    <ProgressSpinner />
  </div>
  <div class="w-full p-0">
    <div class="card">
      <Menubar :model="items" class="h-5rem gap-3">
        <template #end>
          <div class="flex justify-content-end">Hola {{ sessionStore?.username }}!</div>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Menubar from 'primevue/menubar'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { checkIfNotLogged } from '../utils/controlSession.js'
import { useSessionStore } from '../stores/session'
import { useVModel } from '@vueuse/core'
import ProgressSpinner from 'primevue/progressspinner'
import { storeToRefs } from 'pinia'

const props = defineProps<{ userData: Object; isLoading: Boolean }>()
const emit = defineEmits(['update:userData', 'update:isLoading'])

const router = useRouter()
const { stored: sessionStore } = storeToRefs(useSessionStore())

const goto = (path = '') => {
  router.push(path)
}

const vUserData = useVModel(props, 'userData', emit)
const vIsLoading = useVModel(props, 'isLoading', emit)
const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => goto('/home')
  },
  {
    label: 'Enrollment',
    icon: 'pi pi-pen-to-square',
    command: () => goto('/enrollment')
  },
  {
    label: 'Revoke CERT',
    icon: 'pi pi-times',
    command: () => goto('/revoke-certificate')
  },
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: () => logout()
  }
])

const logout = () => {
  vIsLoading.value = true
  sessionStore.value.username = ''
  sessionStore.value.password = ''
  setTimeout(() => {
    goto('/')
  }, 500)
}

onMounted(() => {
  const check = checkIfNotLogged()
  if (check) {
    goto('/')
  } else {
    vUserData.value = {
      username: sessionStore.value.username,
      password: sessionStore.value.password
    }
  }
})
</script>
