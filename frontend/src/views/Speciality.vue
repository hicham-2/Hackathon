<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />
  
    <!-- Contenu principal -->
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Ajouter une Classe</h2>
  
        <!-- Formulaire de détails de la spécialité -->
        <form @submit.prevent="createSpeciality">
          <div class="mb-6">
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '../components/common/Sidebar.vue';

const router = useRouter();

// Représente l'objet de la spécialité
const speciality = ref({
  name: '',
});

// Fonction pour créer la spécialité
const createSpeciality = async () => {
  try {
    const response = await fetch('http://localhost:8080/speciality/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(speciality.value),
    });

    if (response.ok) {
      alert('Spécialité ajoutée avec succès !');
      router.push('/planning'); // Rediriger vers la liste des spécialités après la création
    } else {
      console.error('Erreur lors de la création de la spécialité');
    }
  } catch (error) {
    console.error('Erreur lors de la création de la spécialité :', error);
  }
};
</script>
