<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenu principal -->
    <div class="planning-page flex-1 p-8 bg-gray-100">
      <h1 class="text-3xl font-bold mb-4">Planning</h1>
      <p>Cette page affichera le calendrier des cours.</p>
    </div>
  </div>
</template>

<script>
import Sidebar from '../components/common/Sidebar.vue'; // Assurez-vous que le chemin d'importation est correct

export default {
  name: 'Planning',
  components: {
    Sidebar
  },
};
</script>

<style scoped>
.planning-page {
  padding: 20px;
  background-color: #f7fafc;
}

.planning-page h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}
</style>
