<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Contenu principal -->
      <div class="w-full flex justify-center items-center flex-1 p-8">
        <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-semibold">Liste des Cours</h1>
            <!-- Bouton Ajouter un cours -->
            <router-link to="/createCourse">
              <button   class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ajouter un cours
              </button>
            </router-link>
          </div>
  
          <!-- Tableau des cours -->
          <div class="overflow-x-auto bg-white shadow-md rounded-lg">
            <table class="min-w-full table-auto text-sm">
              <thead>
                <tr class="bg-gray-200">
                  <th class="px-4 py-2 text-left">Nom</th>
                  <th class="px-4 py-2 text-left">Durée</th>
                  <th class="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(course, index) in courses" :key="index">
                  <td class="px-4 py-2">{{ course.name }}</td>
                  <td class="px-4 py-2">{{ course.duration }} heures</td>
                
                    <!-- Bouton Supprimer -->
                <td class="px-4 py-2">
                  <button
                    @click="deleteCourse(course.id)"
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                  </td>
                </tr>
                <!-- Afficher un message quand aucune donnée n'est disponible -->
                <tr v-if="courses.length === 0">
                  <td colspan="5" class="text-center py-4">Aucun cours trouvé.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
import Sidebar from '../components/common/Sidebar.vue';
  
  const courses = ref([]); 
  
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
  
  // Supprimer une salle
const deleteCourse = async (courseId) => {
  if (confirm("Voulez-vous vraiment supprimer ce cours ?")) {
    try {
      const response = await fetch(`http://localhost:8080/course/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Mettre à jour la liste des salles après suppression
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

  
  // Appeler la fonction pour récupérer les professeurs lors du montage du composant
  onMounted(() => {
    fetchCourses();
  });
  </script>
  
  <style scoped>
  /* Ajouter ici des styles spécifiques si nécessaire */
  </style>
  