<template>
  <div class="flex h-screen">
    <Sidebar />

    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-semibold">Liste des Salles</h1>
          
          <button
            @click="openModal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter Salle
          </button>
        </div>

        <div class="overflow-x-auto bg-white shadow-md rounded-lg">
          <table class="min-w-full table-auto text-sm">
            <thead>
              <tr class="bg-gray-200">
                <th class="px-4 py-2 text-left">Nom</th>
                <th class="px-4 py-2 text-left">Capacité</th>
                <th class="px-4 py-2 text-left">Disponible</th>
                <th class="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(room, index) in rooms" :key="index">
                <td class="px-4 py-2">{{ room.name }}</td>
                <td class="px-4 py-2">{{ room.capacity }}</td>
                <td class="px-4 py-2">{{ room.is_available ? 'Oui' : 'Non' }}</td>

                <td class="px-4 py-2">
                  <button
                    @click="deleteRoom(room.id)"
                    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr v-if="rooms.length === 0">
                <td colspan="5" class="text-center py-4">Aucune salle trouvée.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal pour Ajouter Salle -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 class="text-xl font-semibold mb-4">Ajouter une Salle</h2>
        
        <form @submit.prevent="addRoom">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nom de la salle</label>
            <input
              v-model="room.name"
              type="text"
              id="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="capacity" class="block text-sm font-medium text-gray-700">Capacité</label>
            <input
              v-model="room.capacity"
              type="number"
              id="capacity"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div class="mb-4">
            <label for="is_available" class="block text-sm font-medium text-gray-700">Disponible</label>
            <input
              v-model="room.is_available"
              type="checkbox"
              id="is_available"
              class="mt-1 mr-2"
            />
            <span>Oui</span>
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

const rooms = ref([]); 
const isModalOpen = ref(false); 
const room = ref({
  name: '',
  capacity: '',
  is_available: false,
}); 

const fetchRooms = async () => {
  try {
    const response = await fetch('http://localhost:8080/room');
    if (response.ok) {
      rooms.value = await response.json();
    } else {
      console.error('Erreur lors de la récupération des salles');
    }
  } catch (error) {
    console.error('Erreur de réseau', error);
  }
};


const deleteRoom = async (roomId) => {
  if (confirm("Voulez-vous vraiment supprimer cette salle ?")) {
    try {
      const response = await fetch(`http://localhost:8080/room/${roomId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        rooms.value = rooms.value.filter((room) => room.id !== roomId);
        alert("Salle supprimée avec succès !");
      } else {
        console.error("Erreur lors de la suppression de la salle");
        alert("Impossible de supprimer la salle.");
      }
    } catch (error) {
      console.error("Erreur de réseau", error);
      alert("Erreur lors de la connexion au serveur.");
    }
  }
};

// Ouvrir le modal
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  room.value = { name: '', capacity: '', is_available: false }; 
};
const addRoom = async () => {
  if (!room.value.name || !room.value.capacity || isNaN(room.value.capacity)) {
    alert("Veuillez remplir correctement tous les champs.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/room/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: room.value.name, 
        capacity: room.value.capacity, 
        is_available: room.value.is_available, 
      }),
    });

    if (response.ok) {
      room.value = { name: '', capacity: '', is_available: false }; 
      alert("Salle créée avec succès !");
      
      await fetchRooms();
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
      alert("Erreur lors de la création de la salle.");
    }
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    alert("Erreur de réseau.");
  }
};

onMounted(() => {
  fetchRooms();
});
</script>

<style scoped>
</style>
