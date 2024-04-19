<template>
  <div class="w-full p-0">
    <div class="card">
      <Menubar :model="items" class="h-5rem gap-3" />
    </div>
  </div>

</template>

<script setup>
import { ref } from "vue";
import Menubar from 'primevue/menubar';
import { RouterView, useRouter } from 'vue-router';

const router = useRouter();

const goto = (path) => {
  router.push(path);
}

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    command: () => goto('/')
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
  }
]);

</script>
