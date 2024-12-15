<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="w-full flex overflow-y-auto justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Ajouter un Professeur</h2>

        <!-- Formulaire de détails du professeur -->
        <form @submit.prevent="updateProfessor">
          <div class="mb-6">
            <label for="professorName" class="block text-gray-700 text-sm font-bold mb-2">Nom du Professeur</label>
            <input
              id="professorName"
              v-model="professor.name"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Nom du professeur"
              required
            />
          </div>

          <div class="mb-6">
            <label for="professorSpeciality" class="block text-gray-700 text-sm font-bold mb-2">Spécialité</label>
            <input
              id="professorSpeciality"
              v-model="professor.speciality"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Spécialité du professeur"
              required
            />
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
import { useRoute, useRouter } from 'vue-router';
import Sidebar from '../components/common/Sidebar.vue'; // Assurez-vous que le chemin est correct

const route = useRoute();
const router = useRouter();

// Représente l'objet du professeur
const professor = ref({
  id: '',
  name: '',
  speciality: '',
});

// Fonction pour récupérer les détails du professeur depuis le backend
const fetchProfessorDetails = async () => {
  const professorId = route.params.id;  // Utilisation de l'ID du professeur dans l'URL
  try {
    const response = await fetch(`http://localhost:8080/professors/${professorId}`);
    if (response.ok) {
      const data = await response.json();
      professor.value = data;  
    } else {
      console.error("Erreur de récupération des données");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

// Fonction pour mettre à jour le professeur
const updateProfessor = async () => {
  try {
    const response = await fetch(`http://localhost:8080/professors/${professor.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(professor.value),
    });

    if (response.ok) {
      alert("Professeur mis à jour avec succès !");
      router.push('/professors');  // Rediriger vers la liste des professeurs après la mise à jour
    } else {
      console.error("Erreur de mise à jour");
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
  }
};

// Charger les données du professeur au montage du composant
onMounted(() => {
  fetchProfessorDetails();
});
</script>
