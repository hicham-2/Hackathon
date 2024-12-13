<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Ajouter un Professeur</h2>

        <!-- Formulaire de mise à jour des détails du professeur -->
        <form @submit.prevent="createProfessor">
          <div class="mb-6">
            <label for="lastname" class="block text-gray-700 text-sm font-bold mb-2">Nom</label>
            <input
              id="lastname"
              v-model="professor.lastName"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Nom"
              required
            />
          </div>

          <div class="mb-6">
            <label for="firstname" class="block text-gray-700 text-sm font-bold mb-2">Prénom</label>
            <input
              id="firstname"
              v-model="professor.firstName"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Prénom"
              required
            />
          </div>

          <div class="mb-6">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              id="email"
              v-model="professor.email"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="email"
              placeholder="Adresse email"
              required
            />
          </div>

          <div class="mb-6">
  <label for="speciality_id" class="block text-gray-700 text-sm font-bold mb-2">Spécialité</label>
  <select
    id="speciality_id"
    v-model="professor.speciality_id"
    class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
    required
  >
    <option disabled value="">Sélectionnez une spécialité</option>
    <option v-for="speciality in specialities" :key="speciality.id" :value="speciality.id">
      {{ speciality.name }}
    </option>
  </select>
</div>


          <!-- Dropdown pour les salles -->
          <div class="mb-6">
            <label for="room_id" class="block text-gray-700 text-sm font-bold mb-2">Salle</label>
            <select
              id="room_id"
              v-model="professor.room_id"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            >
              <option disabled value="">Sélectionnez une salle</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }}
              </option>
            </select>
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
import Sidebar from '../components/common/Sidebar.vue';

const route = useRoute();
const router = useRouter();

// Représente l'objet du professeur
const professor = ref({
  id: '',
  lastname: '',
  firstname: '',
  email: '',
  role: 'professor',
  speciality_id: '',
  room_id: '', 
});


const rooms = ref([]);

const specialities = ref([]); 


const fetchSpecialities = async () => {
  try {
    const response = await fetch('http://localhost:8080/speciality'); 
    if (response.ok) {
      const data = await response.json();
      specialities.value = data;
    } else {
      console.error('Erreur lors de la récupération des spécialités');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialités :', error);
  }
};

const fetchRooms = async () => {
  try {
    const response = await fetch('http://localhost:8080/room'); 
    if (response.ok) {
      const data = await response.json();
      rooms.value = data;
    } else {
      console.error('Erreur lors de la récupération des salles');
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des salles :', error);
  }
};


const createProfessor = async () => {
  try {
    const response = await fetch(`http://localhost:8080/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(professor.value),
    });

    if (response.ok) {
      alert('Professeur ajouté avec succès !');
      router.push('/professor'); 
    } else {
      console.error('Erreur lors de la création du professeur');
    }
  } catch (error) {
    console.error('Erreur lors de la création du professeur :', error);
  }
};



onMounted(() => {
  fetchRooms();
  fetchSpecialities();
});
</script>
