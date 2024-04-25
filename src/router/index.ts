import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Enrollment from '../views/Enrollment.vue'
import Keys from '../views/Keys.vue'
import CreateCertificate from '../views/CreateCertificate.vue'
import RevokeCertificate from '../views/RevokeCertificate.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/enrollment',
      name: 'enrollment',
      component: Enrollment
    },
    {
      path: '/revoke-certificate',
      name: 'revoke-certificate',
      component: RevokeCertificate
    },
    {
      path: '/create-key',
      name: 'create-key',
      component: Keys
    },
    {
      path: '/create-csr',
      name: 'create-csr',
      component: CreateCertificate
    }
  ]
})

export default router
