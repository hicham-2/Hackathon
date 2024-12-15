<template>
  <aside class="w-64 bg-gray-800 text-white h-screen sticky top-0 ">
    <div class=" flex flex-col p-6">

      <div class="mb-8">

        <h2
          class="text-2xl text-center font-extrabold bg-clip-text text-transparent bg-[linear-gradient(to_right,theme(colors.indigo.400),theme(colors.indigo.100),theme(colors.sky.400),theme(colors.fuchsia.400),theme(colors.sky.400),theme(colors.indigo.100),theme(colors.indigo.400))] bg-[length:200%_auto] animate-gradient">
          Dashboard</h2>
      </div>
      <ul class="space-y-4">

        <li v-if:="authStore.isAdmin">
          <router-link to="/planning" class="sidebar-link">Planning</router-link>
        </li>

        <li v-if:="!authStore.isAdmin">
          <router-link to="/intervenant" class="sidebar-link">Mon Planning</router-link>
        </li>

        <li v-if:="authStore.isAdmin">
          <router-link to="/professors" class="sidebar-link">Professeurs</router-link>
        </li>
        <li v-if:="authStore.isAdmin">
          <router-link to="/rooms" class="sidebar-link">Salles</router-link>
        </li>

        <li v-if:="authStore.isAdmin">
          <router-link to="/speciality" class="sidebar-link">Spécialités</router-link>
        </li>
        <button @click="logout" class="bg-gray-700 text-white px-4 py-2 rounded-md">Deconnexion</button>
      </ul>
    </div>
  </aside>

</template>

<script setup>
// Pas de script nécessaire pour ce composant

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/');
};

</script>

<style scoped>
/* Styles pour la sidebar */
.sidebar-link {
  display: block;
  padding: 12px 20px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s ease;
}

.sidebar-link:hover {
  background-color: lightblue;
  /* Couleur de survol */
  transform: scale(1.05);
}

.sidebar-link:active {
  background-color: lightblue;
  /* Couleur active */
}

.sidebar-link.active {
  background-color: lightblue;
  /* Couleur active permanente pour l'élément actif */
}

/* Fond de la sidebar */
aside {
  background-color: #2d3748;
  /* Couleur de fond principale */
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 0 20px 20px 0;
  /* Bordure arrondie sur la droite */
}

/* Ombre et survol des liens */
.sidebar-link:hover {
  background-color: lightblue;
  /* Changer la couleur du survol */
}

.sidebar-link:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(72, 157, 73, 0.6);
}

/* Espacement et ajustement du texte */
ul {
  padding-left: 0;
  list-style-type: none;
}

li {
  transition: transform 0.2s ease;
}

li:hover {
  transform: translateX(10px);
  /* Effet de déplacement du lien au survol */
}
</style>
