<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="w-full flex justify-center items-center flex-1 p-8">
      <div class="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Créer une filière</h2>

        <form @submit.prevent="createSector">
          <div class="mb-6">
            <label for="sectorName" class="block text-gray-700 text-sm font-bold mb-2">Nom de la filière</label>
            <input
              id="sectorName"
              v-model="sector.name"
              class="appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder="Nom de la filère"
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

const sector = ref({
  name: '',

});

const createSector = async () => {
  if (!sector.value.name ) {
    alert("Veuillez remplir correctement tous les champs.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/sector/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: sector.value.name, 
       
    
      }),
    });

    if (response.ok) {
      alert("Cours créé avec succès !");
      router.push('/sector');
    } else {
      const errorData = await response.json();
      console.error("Erreur:", errorData.message || "Erreur inconnue");
    }
  } catch (error) {
    console.error("Erreur lors de la création :", error);
  }
};

</script>
