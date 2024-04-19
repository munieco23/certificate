<template>
  <div class="w-full p-0">
    <div class="card">
      <Menubar :model="items" class="h-5rem gap-3">
        <template #end>
          <div class="flex justify-content-end">
            Hola {{ store.username }}!
          </div>
        </template>
      </Menubar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menubar from 'primevue/menubar';
import { RouterView, useRouter } from 'vue-router';
import { onMounted } from "vue";
import { checkIfNotLogged } from "../utils/controlSession.js";
import { useSessionStore } from '../stores/session'
import { useVModel } from "@vueuse/core";

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const router = useRouter();
const store = useSessionStore();

const goto = (path) => {
  router.push(path);
}

const vUserData = useVModel(props, 'userData', emit)
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
    label: 'Generate Private Key',
    icon: 'pi pi-key',
    command: () => goto('/private-key')
  },
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: () => logout()
  }
]);

const logout = () => {
  store.username = null;
  store.password = null;
  setTimeout(() => {
    goto('/')
  }, 500);
}

onMounted(() => {
  const check = checkIfNotLogged()
  if (check) {
    goto('/')
  } else {
    debugger
    vUserData.value = { username: store.username, password: store.password }
  }
})

</script>
