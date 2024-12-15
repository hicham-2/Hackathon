<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Contenu principal -->
      <div class="w-full flex justify-center items-center flex-1 p-8 overflow-y-auto">
        <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Détails de la Spécialité</h2>
  
          <!-- Formulaire de détails de la spécialité -->
          <form @submit.prevent="updateSpeciality">
            <div class="mb-6">
              <label for="specialityName" class="block text-gray-700 text-sm font-bold mb-2">Nom de la Spécialité</label>
              <input
                id="specialityName"
                v-model="speciality.name"
                class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                type="text"
                placeholder="Nom de la spécialité"
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
  
  // Représente l'objet de la spécialité
  const speciality = ref({
    id: '',
    name: '',
  });
  
  // Fonction pour récupérer les détails de la spécialité depuis le backend
  const fetchSpecialityDetails = async () => {
    const specialityId = route.params.id;  // Utilisation de l'ID de la spécialité dans l'URL
    try {
      const response = await fetch(`http://localhost:8080/specialities/${specialityId}`);
      if (response.ok) {
        const data = await response.json();
        speciality.value = data;  
      } else {
        console.error("Erreur de récupération des données");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };
  
  // Fonction pour mettre à jour la spécialité
  const updateSpeciality = async () => {
    try {
      const response = await fetch(`http://localhost:8080/specialities/${speciality.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(speciality.value),
      });
  
      if (response.ok) {
        alert("Spécialité mise à jour avec succès !");
        router.push('/specialities');  // Rediriger vers la liste des spécialités après la mise à jour
      } else {
        console.error("Erreur de mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };
  
  // Charger les données de la spécialité au montage du composant
  onMounted(() => {
    fetchSpecialityDetails();
  });
  </script>
  