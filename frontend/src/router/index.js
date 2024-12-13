import { createRouter, createWebHistory } from 'vue-router';
import Classe from '../views/Classe.vue';
import Course from '../views/Course.vue';
import CourseList from '../views/CourseList.vue';
import GlobalCalendarView from '../views/GlobalCalendarView.vue';
import IntervenantView from '../views/IntervenantView.vue';
import Planning from '../views/Planning.vue';
import Professor from '../views/Professors.vue';
import ProfessorsList from '../views/ProfessorsList.vue';
import Room from '../views/Room.vue';
import RoomList from '../views/RoomList.vue';


const routes = [
  {
    path: '/',
    name: 'HomeView',
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
    // meta: { requiresAuth: true ,  roles: ['admin']  },
  },
  {
    path: '/planning',
    name: 'Planning',
    component: Planning,
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },
  {
    path: '/room',
    name: 'Rooms',
    component: RoomList,
    // meta: { requiresAuth: true,  roles: ['admin']  },
  },
  {
    path: '/createRoom',
    name: 'Room',
    component: Room,
    // meta: { requiresAuth: true,  roles: ['admin']  },
  },
  {
    path: '/createProfessor',
    name: 'Professor',
    component: Professor,
    // meta: { requiresAuth: true, roles: ['admin'] }, 
  },
  {
    path: '/professors',
    name: 'Professors',
    component: ProfessorsList
    // meta: { requiresAuth: true, roles: ['admin'] }, 
  },
  {
    path: '/createClasse',
    name: 'Classe',
    component: Classe,
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },

  {
    path: '/course',
    name: 'Courses',
    component: CourseList,
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },

  {
    path: '/createCourse',
    name: 'Course',
    component: Course,
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },

  {
    path: '/intervenant',
    name: 'intervenant',
    component: IntervenantView,
    // meta: { requiresAuth: true ,  roles: ['admin'] },
  },
  {
    path: '/global-calendar',
    name: 'global-calendar',
    component: GlobalCalendarView,
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
