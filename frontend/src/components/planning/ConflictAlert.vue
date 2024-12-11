<template>
    <div v-if="conflicts.length > 0" class="alert bg-red-500 text-white p-4">
      <h3>Conflits détectés :</h3>
      <ul>
        <li v-for="conflict in conflicts" :key="conflict.id">{{ conflict.message }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: ['conflicts'],
  };
  </script>
  