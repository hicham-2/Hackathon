<template>
  <div class="flex h-screen">
    <Sidebar />

    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold">Liste des Professeurs</h1>
          <router-link to="/createProfessor">
            <button   class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ajouter Professeur
            </button>
          </router-link>
        </div>

        <div class="overflow-x-auto bg-white shadow-md rounded-lg">
          <table class="min-w-full table-auto text-sm">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2 text-left">Nom</th>
                <th class="px-4 py-2 text-left">Prénom</th>
                <th class="px-4 py-2 text-left">Email</th>
                <th class="px-4 py-2 text-left">Rôle</th>
                <th class="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(professor, index) in professors" :key="index">
                <td class="px-4 py-2">{{ professor.lastName }}</td>
                <td class="px-4 py-2">{{ professor.firstName }}</td>
                <td class="px-4 py-2">{{ professor.email }}</td>
                <td class="px-4 py-2">{{ professor.role }}</td>
             
                <td class="px-4 py-2">
                  <button
                    @click="deleteProfessor(professor.id)"
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr v-if="professors.length === 0">
                <td colspan="5" class="text-center py-4">Aucun professeur trouvé.</td>
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

const professors = ref([]); 


const fetchProfessors = async () => {
  try {
    const response = await fetch('http://localhost:8080/user/professors');
    if (response.ok) {
      const users = await response.json();
      professors.value = users.filter(user => user.role === 'professor');
    } else {
      console.error('Erreur lors de la récupération des professeurs');
    }
  } catch (error) {
    console.error('Erreur de réseau', error);
  }
};

const deleteProfessor = async (professorId) => {
  if (confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
    try {
      const response = await fetch(`http://localhost:8080/user/professors/${professorId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        professors.value = professors.value.filter((professor) => professor.id !== professorId);
        alert("Professeur supprimée avec succès !");
      } else {
        console.error("Erreur lors de la suppression du professeur");
        alert("Impossible de supprimer le professeur.");
      }
    } catch (error) {
      console.error("Erreur de réseau", error);
      alert("Erreur lors de la connexion au serveur.");
    }
  }
};


onMounted(() => {
  fetchProfessors();
});
</script>

<style scoped>
/* Ajouter ici des styles spécifiques si nécessaire */
</style>
