<template>
  <div class="flex h-screen">
    <Sidebar />
  
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold">Liste des Filières</h1>
          <button
            @click="openModal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter une filière
          </button>
        </div>
  
        <div class="overflow-x-auto bg-white shadow-md rounded-lg">
          <table class="min-w-full table-auto text-sm">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2 text-left">Nom</th>
                <th class="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(sector, index) in sectors" :key="index">
                <td class="px-4 py-2">{{ sector.name }}</td>
                <td class="px-4 py-2">
                  <button
                    @click="deleteSector(sector.id)"
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr v-if="sectors.length === 0">
                <td colspan="2" class="text-center py-4">Aucune filière trouvée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  
    <!-- Modal pour Ajouter une Filière -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 class="text-xl font-semibold mb-4">Ajouter une Filière</h2>
        
        <form @submit.prevent="addSector">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom de la filière</label>
            <input
              v-model="newSector.name"
              type="text"
              id="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
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

const sectors = ref([]);
const isModalOpen = ref(false);
const newSector = ref({ name: '' });

const fetchSectors = async () => {
  try {
    const response = await fetch('http://localhost:8080/sector');
    if (response.ok) {
      sectors.value = await response.json();
    } else {
      console.error('Erreur lors de la récupération des filières');
    }
  } catch (error) {
    console.error('Erreur de réseau', error);
  }
};

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  newSector.value.name = ''; 
};

const addSector = async () => {
  if (!newSector.value.name) {
    alert("Veuillez entrer le nom de la filière.");
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/sector/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSector.value),
    });

    if (response.ok) {
      alert("Filière ajoutée avec succès !");
      fetchSectors();  
      closeModal();
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
      alert("Erreur lors de l'ajout de la filière.");
    }
  } catch (error) {
    console.error("Erreur de réseau", error);
    alert("Erreur de connexion au serveur.");
  }
};

const deleteSector = async (sectorId) => {
  if (confirm("Voulez-vous vraiment supprimer cette filière ?")) {
    try {
      const response = await fetch(`http://localhost:8080/sector/${sectorId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        sectors.value = sectors.value.filter((sector) => sector.id !== sectorId);
        alert("Filière supprimée avec succès !");
      } else {
        console.error("Erreur lors de la suppression de la filière");
        alert("Impossible de supprimer la filière.");
      }
    } catch (error) {
      console.error("Erreur de réseau", error);
      alert("Erreur lors de la connexion au serveur.");
    }
  }
};

onMounted(() => {
  fetchSectors();
});
</script>

<style scoped>
</style>
