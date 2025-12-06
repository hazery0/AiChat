import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import ChatRoom from '../views/ChatRoom.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/chat/:roomId',
    name: 'ChatRoom',
    component: ChatRoom
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
