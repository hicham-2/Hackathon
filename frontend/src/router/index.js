import { createRouter, createWebHistory } from 'vue-router';
import Planning from '../views/Planning.vue';
import Professors from '../views/Professors.vue';
import Rooms from '../views/Room.vue';
import Speciality from '../views/Speciality.vue';

const routes = [
 
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    // component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/planning',
    name: 'Planning',
    component: Planning,
    // meta: { requiresAuth: true },
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: Rooms,
    // meta: { requiresAuth: true },
  },
  {
    path: '/professors',
    name: 'Professors',
    component: Professors,
    // meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/speciality',
    name: 'Speciality',
    component: Speciality,
    // meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Exemple : 'admin' ou 'professor'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/'); // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
  } else {
    next();
  }
});

export default router;
