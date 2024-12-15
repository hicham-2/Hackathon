<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar />
  
      <!-- Contenu principal -->
      <div class="w-full flex justify-center items-center flex-1 p-8 overflow-y-auto">
        <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
          <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Détails de la Salle</h2>
  
          <!-- Formulaire de détails de la chambre -->
          <form @submit.prevent="updateRoom">
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
  
            <div class="mb-6">
              <label for="roomDescription" class="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                id="roomDescription"
                v-model="room.description"
                class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Description de la salle"
                rows="4"
                required
              ></textarea>
            </div>

             <!-- Checkbox is_available -->
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
              <button
                @click.prevent="deleteRoom"
                class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Supprimer
              </button>
            </div>
          </form>
  
          <!-- Affichage de l'ID de la salle -->
          <!-- <p class="text-gray-600 mt-4">ID de la salle : {{ room.id }}</p> -->
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
  
  // Représente l'objet de la salle
  const room = ref({
    id: '',
    name: '',
    capacity: '',
    description: '',
  });
  
  // Fonction pour récupérer les détails de la salle depuis le backend
  const fetchRoomDetails = async () => {
    const roomId = route.params.id;  // Utilisation de l'ID de la chambre dans l'URL
    try {
      const response = await fetch(`http://localhost:8080/rooms/${roomId}`);
      if (response.ok) {
        const data = await response.json();
        room.value = data;  
      } else {
        console.error("Erreur de récupération des données");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };
  
  // Fonction pour mettre à jour la salle
  const updateRoom = async () => {
    try {
      const response = await fetch(`http://localhost:8080/rooms/${room.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(room.value),
      });
  
      if (response.ok) {
        alert("Chambre mise à jour avec succès !");
        router.push('/rooms');  // Rediriger vers la liste des chambres après la mise à jour
      } else {
        console.error("Erreur de mise à jour");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };
  
  // Fonction pour supprimer la chambre
  const deleteRoom = async () => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cette chambre ?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/rooms/${room.value.id}`, {
          method: 'DELETE',
        });
   
        if (response.ok) {
          alert("Chambre supprimée avec succès !");
          router.push('/rooms');  // Rediriger après la suppression
        } else {
          console.error("Erreur de suppression");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
      }
    }
  };
  
  // Charger les données de la chambre au montage du composant
  onMounted(() => {
    fetchRoomDetails();
  });
  </script>
  
  <style scoped>
  /* Ajoutez vos styles personnalisés ici si nécessaire */
  </style>
  