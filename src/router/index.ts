import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Enrollment from '../views/Enrollment.vue'
import CreatePrivateKey from '../views/PrivateKey.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/enrollment',
      name: 'enrollment',
      component: Enrollment
    },
    {
      path: '/private-key',
      name: 'private-key',
      component: CreatePrivateKey
    }
  ]
})

export default router
