<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Créer un Cours</h2>

        <!-- Formulaire de création du cours -->
        <form @submit.prevent="createCourse">
          <div class="mb-6">
            <label for="courseName" class="block text-gray-700 text-sm font-bold mb-2">Nom du Cours</label>
            <input
              id="courseName"
              v-model="course.name"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Nom du cours"
              required
            />
          </div>

          <div class="mb-6">
            <label for="courseDuration" class="block text-gray-700 text-sm font-bold mb-2">Durée</label>
            <input
              id="courseDuration"
              v-model="course.duration"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="number"
              placeholder="Durée du cours"
              required
            />  
          </div>

           <!-- Dropdown pour sélectionner la filière -->
           <div class="mb-6">
            <label for="sector" class="block text-gray-700 text-sm font-bold mb-2">Filière</label>
            <select
              id="sector"
              v-model="course.sector_id"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              required
            >
              <option value="" disabled selected>Choisissez une filière</option>
              <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                {{ sector.name }}
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
import { useRouter } from 'vue-router';
import Sidebar from '../components/common/Sidebar.vue';

const router = useRouter();

const course = ref({
  name: '',
  duration: '',
  sector_id: '', 

});

const createCourse = async () => {
  if (!course.value.name || !course.value.duration) {
    alert("Veuillez remplir correctement tous les champs.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/course/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: course.value.name, 
        duration: course.value.duration,
        sector_id: course.value.sector_id,
    
      }),
    });

    if (response.ok) {
      alert("Cours créé avec succès !");
      router.push('/course');
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
    }
  } catch (error) {
    console.error("Erreur lors de la création :", error);
  }
};

const sectors = ref([]); // Liste des secteurs (filières)

// Fonction pour récupérer les secteurs depuis l'API
const getSectors = async () => {
  try {
    const response = await fetch('http://localhost:8080/sector');
    if (response.ok) {
      const data = await response.json();
      sectors.value = data; // Assurez-vous que votre API renvoie la liste des secteurs
    } else {
      console.error('Erreur lors de la récupération des secteurs');
    }
  } catch (error) {
    console.error('Erreur réseau lors de la récupération des secteurs:', error);
  }
};

onMounted(() => {
  getSectors();
});

</script>
