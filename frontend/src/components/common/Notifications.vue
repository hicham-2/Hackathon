<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
      <h2 class="text-xl">Notifications</h2>
      <ul>
        <li v-for="notification in notifications" :key="notification.id">
          {{ notification.message }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: ['notifications'],
  };
  </script>
  