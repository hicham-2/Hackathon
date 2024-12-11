import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IntervenantView from '../views/IntervenantView.vue'
import GlobalCalendarView from '../views/GlobalCalendarView.vue'
import TestView from '@/views/testView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/intervenant',
      name: 'intervenant',
      component: IntervenantView
    },
    {
      path: '/global-calendar',
      name: 'global-calendar',
      component: GlobalCalendarView
    },
    {
      path: '/test',
      name: 'test',
      component: TestView
    }
  ]
})

export default router