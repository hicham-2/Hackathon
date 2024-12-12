<script setup>
import TheWelcome from '../components/auth/LoginForm.vue';
</script>

<template>
  <div class="home">
    <!-- Si vous voulez garder le logo Vue -->
    <img alt="Vue logo" src="@/assets/logo.svg">
    <div class="content">
      <h1>Bienvenue sur le Planning AI</h1>
      <p>Système de gestion de planning intelligent</p>
      
      <!-- Cartes de fonctionnalités -->
      <div class="features">
        <div class="feature-card">
          <h3>Gestion des Intervenants</h3>
          <p>Gérez les disponibilités et planning des intervenants</p>
          <router-link to="/intervenant" class="btn">Accéder</router-link>
        </div>
 
        <div class="feature-card">
          <h3>Planning Global</h3>
          <p>Vue d'ensemble des plannings</p>
          <router-link to="/planning" class="btn">Accéder</router-link>
        </div>
 
        <div class="feature-card">
          <h3>Tableau de bord</h3>
          <p>Statistiques et informations clés</p>
          <router-link to="/dashboard" class="btn">Accéder</router-link>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script>
 export default {
  name: 'HomeView'
 }
 </script>
 
 <style scoped>
 .home {
  padding: 20px;
 }
 
 .content {
  margin-top: 40px;
 }
 
 h1 {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 20px;
 }
 
 .features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
  padding: 20px;
 }
 
 .feature-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
 }
 
 .feature-card:hover {
  transform: translateY(-5px);
 }
 
 .feature-card h3 {
  color: #42b983;
  margin-bottom: 15px;
 }
 
 .btn {
  display: inline-block;
  background: #42b983;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  margin-top: 15px;
  transition: background 0.3s ease;
 }
 
 .btn:hover {
  background: #3aa876;
 }
 </style>