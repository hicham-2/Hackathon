<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="w-full flex overflow-y-auto justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Ajouter un Professeur</h2>

        <!-- Formulaire de mise à jour des détails du professeur -->
        <form @submit.prevent="createProfessor">
          <div class="mb-6">
            <label for="lastname" class="block text-gray-700 text-sm font-bold mb-2">Nom</label>
            <input
              id="lastname"
              v-model="professor.lastName"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Nom"
              required
            />
          </div>

          <div class="mb-6">
            <label for="firstname" class="block text-gray-700 text-sm font-bold mb-2">Prénom</label>
            <input
              id="firstname"
              v-model="professor.firstName"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Prénom"
              required
            />
          </div>

          <div class="mb-6">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              id="email"
              v-model="professor.email"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="email"
              placeholder="Adresse email"
              required
            />
          </div>

          <!-- Section pour ajouter les cours -->
          <div class="mb-6">
            <label for="courses" class="block text-gray-700 text-sm font-bold mb-2">Cours</label>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="course in courses" :key="course.id" class="flex items-center">
                <input
                  type="checkbox"
                  :value="course.id"
                  v-model="professor.courses"
                  class="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                />
                <span class="ml-2 text-gray-700">{{ course.name }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '../components/common/Sidebar.vue';

const router = useRouter();

const professor = ref({
  id: '',
  lastName: '',
  firstName: '',
  email: '',
  role: 'professor',
  courses: [],
});

const courses = ref([]);

const loading = ref(false);
const errorMessage = ref('');

// Fonction pour récupérer les cours depuis l'API
const fetchCourses = async () => {
  try {
    const response = await fetch('http://localhost:8080/course');
    if (response.ok) {
      courses.value = await response.json();
    } else {
      throw new Error('Erreur lors de la récupération des cours');
    }
  } catch (error) {
    errorMessage.value = error.message;
    console.error(error);
  }
};

// Fonction pour créer un professeur
const createProfessor = async () => {
  loading.value = true;
  try {
    const response = await fetch('http://localhost:8080/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(professor.value),
    });
    if (response.ok) {
      alert('Professeur ajouté avec succès !');
      router.push('/professors');
    } else {
      throw new Error('Erreur lors de la création du professeur');
    }
  } catch (error) {
    errorMessage.value = error.message;
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// Récupérer les cours lorsque le composant est monté
onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
/* Ajouter des styles spécifiques si nécessaire */
</style>
