<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <div class="flex-1 bg-gray-100">
       
        <div class="p-6">
          <h2 class="text-2xl font-bold">Dashboard</h2>
          <p class="mt-4">Welcome to your Dashboard!</p>
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
  