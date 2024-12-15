import { createRouter, createWebHistory } from 'vue-router';
import Classe from '../views/Classe.vue';
import Course from '../views/Course.vue';
import CourseList from '../views/CourseList.vue';
import Dashboard from '../views/Dashboard.vue';
import GlobalCalendarView from '../views/GlobalCalendarView.vue';
import IntervenantView from '../views/IntervenantView.vue';
import Login from '../views/Login.vue';
import Planning from '../views/Planning.vue';
import Professor from '../views/Professors.vue';
import ProfessorsList from '../views/ProfessorsList.vue';
import Room from '../views/Room.vue';
import RoomList from '../views/RoomList.vue';
import Sector from '../views/Sector.vue';
import SectorList from '../views/SectorList.vue';



const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/planning',
    name: 'Planning',
    component: Planning,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/room',
    name: 'Rooms',
    component: RoomList,
    meta: { requiresAuth: true, roles: ['admin'] },
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
     meta: { requiresAuth: true, roles: ['admin'] }, 
  },
  {
    path: '/professors',
    name: 'Professors',
    component: ProfessorsList,
     meta: { requiresAuth: true, roles: ['admin'] }, 
    
  },
  {
    path: '/createClasse',
    name: 'Classe',
    component: Classe,
     meta: { requiresAuth: true ,  roles: ['admin'] },
  },

  {
    path: '/course',
    name: 'Courses',
    component: CourseList,
     meta: { requiresAuth: true ,  roles: ['admin'] },
  },

  {
    path: '/createCourse',
    name: 'Course',
    component: Course,
     meta: { requiresAuth: true ,  roles: ['admin'] },
  },


  {
    path: '/sector',
    name: 'Sectors',
    component: SectorList,
     meta: { requiresAuth: true ,  roles: ['admin'] },
  },

  {
    path: '/createSector',
    name: 'Sector',
    component: Sector,
    meta: { requiresAuth: true, roles: ['admin', 'professor'] },
  },
  // {
  //   path: '/speciality',
  //   name: 'Speciality',
  //   component: Speciality,
  //   meta: { requiresAuth: true, roles: ['admin'] },
  // },

  {
    path: '/intervenant',
    name: 'intervenant',
    component: IntervenantView,
    meta: { requiresAuth: true, roles: ['admin', 'professor'] },
  },
  {
    path: '/global-calendar',
    name: 'global-calendar',
    component: GlobalCalendarView,
    meta: { requiresAuth: true, roles: ['admin', 'professor'] },
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
