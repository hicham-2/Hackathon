<template>
  <div class="flex h-screen">
    <Sidebar />

    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold">Liste des Professeurs</h1>
          <!-- Bouton Ajouter Professeur -->
          <button
            @click="openModal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter Professeur
          </button>
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

    <!-- Modal pour Ajouter un Professeur -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 class="text-xl font-semibold mb-4">Ajouter un Professeur</h2>
        
        <form @submit.prevent="addProfessor">
          <div class="mb-4">
            <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              v-model="newProfessor.firstName"
              type="text"
              id="firstName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
            <input
              v-model="newProfessor.lastName"
              type="text"
              id="lastName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="newProfessor.email"
              type="email"
              id="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-6">
  <label for="course_id" class="block text-gray-700 text-sm font-bold mb-2">Cours</label>
  <div class="grid grid-cols-4 gap-4">
    <div v-for="course in courses" :key="course.id" class="flex items-center">
      <input
        type="checkbox"
        :value="course.id"
        v-model="newProfessor.courses" 
        class="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
      />
      <span class="ml-2 text-gray-700">{{ course.name }}</span>
    </div>
  </div>
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

const professors = ref([]);
const isModalOpen = ref(false);
const newProfessor = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: 'professor',
  courses: [],
});

const courses = ref([]);

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


const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  newProfessor.value = { firstName: '', lastName: '', email: '', role: 'professor' }; // Réinitialiser les champs du formulaire
};

const addProfessor = async () => {
  if (!newProfessor.value.firstName || !newProfessor.value.lastName || !newProfessor.value.email) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/user/professors/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProfessor.value),
    });

    if (response.ok) {
      alert("Professeur ajouté avec succès !");
      fetchProfessors();  // Mettre à jour la liste des professeurs
      closeModal();
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
      alert("Erreur lors de l'ajout du professeur.");
    }
  } catch (error) {
    console.error("Erreur de réseau", error);
    alert("Erreur de connexion au serveur.");
  }
};

const deleteProfessor = async (professorId) => {
  if (confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
    try {
      const response = await fetch(`http://localhost:8080/user/professors/${professorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        professors.value = professors.value.filter((professor) => professor.id !== professorId);
        alert("Professeur supprimé avec succès !");
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
  fetchCourses();
});
</script>

<style scoped>
</style>
