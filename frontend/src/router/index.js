import { createRouter, createWebHistory } from 'vue-router';
import Planning from '../views/Planning.vue';
import Professors from '../views/Professors.vue';
import Rooms from '../views/Room.vue';
import Speciality from '../views/Speciality.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true  },
  },
  {
    path: '/planning',
    name: 'Planning',
    component: Planning,
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: Rooms,
    // meta: { requiresAuth: true,  roles: ['admin']  },
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
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Vérifiez si l'utilisateur est connecté
  const userRole = localStorage.getItem('role'); // Rôle de l'utilisateur : 'admin' ou 'professor'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return next('/login');
  }

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    // Si le rôle ne correspond pas, redirigez vers la route appropriée
    if (userRole === 'admin') {
      return next('/dashboard');
    } else if (userRole === 'professor') {
      return next('/');
    } else {
      return next('/login'); // Redirection par défaut
    }
  }

  // Autorisez la navigation si aucune condition n'est violée
  next();
});


export default router;