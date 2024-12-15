<template>
  <div class="flex h-screen">
    <Sidebar />
  
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold">Liste des Cours</h1>
          <button
            @click="openModal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter un cours
          </button>
        </div>
  
        <div class="overflow-x-auto bg-white shadow-md rounded-lg">
          <table class="min-w-full table-auto text-sm">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2 text-left">Nom</th>
                <th class="px-4 py-2 text-left">Durée</th>
                <th class="px-4 py-2 text-left">Filière</th>
                <th class="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(course, index) in courses" :key="index">
                <td class="px-4 py-2">{{ course.name }}</td>
                <td class="px-4 py-2">{{ course.duration }} heures</td>
                <td class="px-4 py-2">
                  {{ getSectorName(course.sector_id) || 'Non spécifié' }}
                </td>
                <td class="px-4 py-2">
                  <button
                    @click="deleteCourse(course.id)"
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr v-if="courses.length === 0">
                <td colspan="5" class="text-center py-4">Aucun cours trouvé.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 class="text-xl font-semibold mb-4">Ajouter un Cours</h2>
        
        <form @submit.prevent="addCourse">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom du cours</label>
            <input
              v-model="course.name"
              type="text"
              id="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="duration" class="block text-sm font-medium text-gray-700">Durée (en heures)</label>
            <input
              v-model="course.duration"
              type="number"
              id="duration"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="sector_id" class="block text-sm font-medium text-gray-700">Filière</label>
            <select
              v-model="course.sector_id"
              id="sector_id"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                {{ sector.name }}
              </option>
            </select>
          </div>

          <div class="flex justify-end">
            <button
              @click="closeModal"
              type="button"
              class="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Sidebar from '../components/common/Sidebar.vue';

const courses = ref([]);
const sectors = ref([]); 
const isModalOpen = ref(false);
const course = ref({
  name: '',
  duration: '',
  sector_id: null,
});

const fetchCourses = async () => {
  try {
    const response = await fetch('http://localhost:8080/course');
    if (response.ok) {
      courses.value = await response.json();
    } else {
      console.error('Erreur lors de la récupération des cours');
    }
  } catch (error) {
    console.error('Erreur de réseau', error);
  }
};

const getSectors = async () => {
  try {
    const response = await fetch('http://localhost:8080/sector');
    if (response.ok) {
      sectors.value = await response.json();
    } else {
      console.error('Erreur lors de la récupération des secteurs');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la récupération des secteurs:', error);
  }
};

const getSectorName = (sector_id) => {
  const sector = sectors.value.find((s) => s.id === sector_id);
  return sector ? sector.name : null;
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  course.value = { name: '', duration: '', sector_id: null };
};

const addCourse = async () => {
  if (!course.value.name || !course.value.duration || !course.value.sector_id) {
    alert("Veuillez remplir correctement tous les champs.");
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/course/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(course.value),
    });

    if (response.ok) {
      alert("Cours ajouté avec succès !");
      fetchCourses();  
      closeModal();
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
      alert("Erreur lors de l'ajout du cours.");
    }
  } catch (error) {
    console.error("Erreur de réseau", error);
    alert("Erreur de connexion au serveur.");
  }
};

const deleteCourse = async (courseId) => {
  if (confirm("Voulez-vous vraiment supprimer ce cours ?")) {
    try {
      const response = await fetch(`http://localhost:8080/course/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        courses.value = courses.value.filter((course) => course.id !== courseId);
        alert("Cours supprimé avec succès !");
      } else {
        console.error("Erreur lors de la suppression du cours");
        alert("Impossible de supprimer le cours.");
      }
    } catch (error) {
      console.error("Erreur de réseau", error);
      alert("Erreur lors de la connexion au serveur.");
    }
  }
};

onMounted(() => {
  fetchCourses();
  getSectors();
});
</script>

<style scoped>
</style>
