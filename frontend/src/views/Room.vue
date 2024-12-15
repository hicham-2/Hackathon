<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Créer une Salle</h2>

        <!-- Formulaire de création de la salle -->
        <form @submit.prevent="createRoom">
          <div class="mb-6">
            <label for="roomName" class="block text-gray-700 text-sm font-bold mb-2">Nom de la Salle</label>
            <input
              id="roomName"
              v-model="room.name"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Nom de la salle"
              required
            />
          </div>

          <div class="mb-6">
            <label for="roomCapacity" class="block text-gray-700 text-sm font-bold mb-2">Capacité</label>
            <input
              id="roomCapacity"
              v-model="room.capacity"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="number"
              placeholder="Capacité maximale"
              required
            />
          </div>

          <div class="mb-6 flex items-center">
            <input
              id="roomAvailable"
              v-model="room.is_available"
              type="checkbox"
              class="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all"
            />
            <label for="roomAvailable" class="ml-2 text-gray-700 text-sm font-bold">Disponible</label>
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

const room = ref({
  name: '',
  capacity: '',
  is_available: false,
});

const createRoom = async () => {
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
      alert("Salle créée avec succès !");
      router.push('/room');
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
    }
  } catch (error) {
    console.error("Erreur lors de la création :", error);
  }
};

</script>
