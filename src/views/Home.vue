<script setup lang="ts">
import { ref } from "vue";
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from "primevue/button";
import { useCreateCertificate, useCertificateRequest } from '../utils/certificateApi.js';

const selectedOptions = ref();
const certificateText = ref("");

const options = ref([
  { name: 'Host 1', code: '1' },
  { name: 'Host 2', code: '2' },
  { name: 'Host 3', code: '3' }
]);

const createCertificate = async () => {
  const res = await useCreateCertificate();

  // Create a Blob from the ArrayBuffer

  const blob = new Blob([res], { type: 'application/x-x509-ca-cert' });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'newApiCert.cer'; // Specify the filename
  anchor.style.display = 'none';

  // Append the anchor to the body and trigger the download
  document.body.appendChild(anchor);
  anchor.click();

  // Cleanup: remove the anchor and revoke the URL
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

const requestCertificate = async () => {
  const res = await useCertificateRequest();
  console.log(res);
}

</script>

<template>
  <div class="card flex flex-column justify-content-center">
    <h2 class="mb-2">TLS certification authentication</h2>
    <Dropdown v-model="selectedOptions" :options="options" optionLabel="name" placeholder="Select an option"
      class="w-full md:w-20rem" />
    <Textarea v-model="certificateText" class="w-full md:w-20rem mt-3"
      placeholder="Paste certificate text here"></Textarea>
    <Button label="Send" class="w-full md:w-20rem mt-3" @click="getCertificate()"></Button>

    <Button label="Create & validate CERT" class="w-full md:w-20rem mt-3" severity="info"
      @click="createCertificate()"></Button>

    <Button label="Request certificate" class="w-full md:w-20rem mt-3" severity="warning"
      @click="requestCertificate()"></Button>
  </div>
</template>