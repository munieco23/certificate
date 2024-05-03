<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Navbar v-model:userData="userData"></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-3">
      <h1 class="w-full text-center mb-2">🙌🏼</h1>
      <h1 class="w-full text-center mb-2">Welcome!</h1>
      <p class="w-full text-center text-xl mb-4">This is a testing site for:</p>
      <ul>
        <li class="text-xl">Enrollment certificates created by user</li>
        <li class="text-xl">Revoke certificates</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../components/NavBar.vue'
const userData = ref({
  username: '',
  password: ''
})
</script>
