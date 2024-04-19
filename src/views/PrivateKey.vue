<template>
  <Navbar></Navbar>
  <div class="main flex justify-content-center">
    <div class="col-4">
      <h1 class="mb-3 text-center">Generate Private Key</h1>
      <div class="p-0 flex flex-column gap-3">
        <Button label="Generate" class="w-20rem m-auto p-button" :disabled="true" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import Button from "primevue/button";
import Navbar from '../components/NavBar.vue'

</script>