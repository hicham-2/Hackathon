<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <div class="flex-1 bg-gray-100">
       
        <div class="p-6">
      
          <h1 class="text-2xl font-bold">Bienvenue sur le Planning AI</h1>
          <p class="mt-4">Système de gestion de planning intelligent</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import Sidebar from '../components/common/Sidebar.vue';
  
  export default {
    components: {
      Sidebar,
    
    }
  }
  </script>
  
  <style scoped>
  /* Styles spécifiques si nécessaires */
  </style>
  