<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <nav class="bg-gray-900 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">Dashboard</h1>
        <div>
          <button @click="logout" class="bg-gray-700 text-white px-4 py-2 rounded-md">Logout</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    }
  }
  </script>
  
  <style scoped>
  /* Styles spécifiques si nécessaires */
  </style>
  