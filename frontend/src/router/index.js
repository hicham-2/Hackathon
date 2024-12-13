import { createRouter, createWebHistory } from 'vue-router'
import GlobalCalendarView from '../views/GlobalCalendarView.vue'
import IntervenantView from '../views/IntervenantView.vue'
import Planning from '../views/Planning.vue'
import Professors from '../views/Professors.vue'
import Rooms from '../views/Room.vue'
import Speciality from '../views/Speciality.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true, roles: ['admin', 'professor'] },
  },
  {
    path: '/planning',
    name: 'Planning',
    component: Planning,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/rooms',
    name: 'Rooms',
    component: Rooms,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/professors',
    name: 'Professors',
    component: Professors,
    meta: { requiresAuth: true, roles: ['admin', 'professor'] },
  },
  {
    path: '/speciality',
    name: 'Speciality',
    component: Speciality,
    meta: { requiresAuth: true, roles: ['admin'] },
  },

  {
    path: '/intervenant',
    name: 'intervenant',
    component: IntervenantView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/global-calendar',
    name: 'global-calendar',
    component: GlobalCalendarView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')) : null; // Token from localStorage
  const userRole = localStorage.getItem('role') ? JSON.parse(localStorage.getItem('role')) : null; // Role of the user ('admin' or 'professor')

  // If route requires authentication but user is not authenticated
  if (to.meta.requiresAuth && !token) {
    console.log('User not authenticated, redirecting to login');
    return next('/'); // Redirect to login if not authenticated
  }

  // If route requires a role validation
  if (to.meta.requiresAuth) {
    try {
      // Validate the role with the backend
      const response = await fetch('http://localhost:8080/user/checkRole', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log('Role check failed, redirecting to login');
        return next('/'); // Redirect to login if the API request fails
      }

      const data = await response.json();
      const roleFromBackend = data.role;

      // If the frontend role doesn't match the backend role, clear local storage and redirect to login
      if (userRole !== roleFromBackend) {
        console.log('Role mismatch, redirecting to login');
        localStorage.clear(); // Clear invalid local storage
        return next('/'); // Redirect to login
      }

      // If the route requires a specific role, ensure the user has access
      if (to.meta.roles && !to.meta.roles.includes(roleFromBackend)) {
        console.log(`Access denied for role ${roleFromBackend}, redirecting to default`);
        if (roleFromBackend === 'admin') {
          return next('/dashboard'); // Redirect admin to dashboard
        } else if (roleFromBackend === 'professor') {
          return next('/intervenant'); // Redirect professor to their home page
        }
      }
    } catch (error) {
      console.error('Error during role verification:', error);
      return next('/'); // Redirect to login on any error
    }
  }

  // If all conditions pass, allow navigation
  next();
});


export default router
