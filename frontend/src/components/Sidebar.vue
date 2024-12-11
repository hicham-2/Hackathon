
<template>
    <div class="sidebar bg-gray-800 text-white h-screen p-6 flex flex-col justify-between">
      <div class="space-y-6">
        <button class="hover:bg-gray-700 rounded-md p-2 w-full text-left" @click="showCalendar">
          <svg class="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
          </svg>
          Afficher le planning
        </button>
        <button class="hover:bg-gray-700 rounded-md p-2 w-full text-left" @click="showProfile">
          <svg class="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
          </svg>
          Afficher le profil
        </button>
        <button class="hover:bg-gray-700 rounded-md p-2 w-full text-left" @click="logout">
          <svg class="w-6 h-6 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
          </svg>
          Se déconnecter
        </button>
      </div>
      <div>
        <p class="text-gray-400 text-sm">Version 1.0</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',
    methods: {
      showCalendar() {
        // Code pour afficher le planning
      },
      showProfile() {
        // Code pour afficher le profil
      },
      logout() {
        // Code pour se déconnecter
      }
    }
  }
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
  }
  </style>