<template>
  <div class="min-h-screen bg-gray flex justify-center items-center">
    <div class="w-full max-w-md">
      <form class="bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 transform transition-all hover:scale-105">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">Connexion</h2>
        
        <div class="mb-6">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <div class="relative">
            <input
              id="email"
              class="appearance-none border-2 border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="email"
              placeholder="votre@email.com"
              aria-describedby="emailHelp"
              v-model="email"
            />
            <span v-if="emailError" class="text-xs text-red-600 mt-1" id="emailHelp">{{ emailError }}</span>
          </div>
        </div>

        <div class="mb-8">
          <label for="password" class="block text-gray-700 text-sm font-bold mb-2">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              class="appearance-none border-2 border-gray-200 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="password"
              placeholder="••••••••"
              aria-describedby="passwordHelp"
              v-model="password"
            />
            <span v-if="passwordError" class="text-xs text-red-600 mt-1" id="passwordHelp">{{ passwordError }}</span>
          </div>
        </div>

        <div class="flex flex-col space-y-4">
          <button
            @click.prevent="login"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all hover:scale-105"
            type="submit"
          >
            Se connecter
          </button>
          
          <div class="flex items-center justify-between">
            <a
              href="#"
              class="font-medium text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mot de passe oublié ?
            </a>
            <!-- <a
              href="#"
              class="font-medium text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Créer un compte
            </a> -->
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const emailError = ref('');
const passwordError = ref('');

// Fonction pour effectuer la connexion et valider les informations
const login = async () => {
  emailError.value = '';
  passwordError.value = '';

  if (!email.value.trim() || !password.value.trim()) {
  emailError.value = email.value.trim() ? '' : 'Email requis';
  passwordError.value = password.value.trim() ? '' : 'Mot de passe requis';
  return;
}


  try {
    // Appel au backend pour vérifier les informations d'identification
    const response = await fetch("http://localhost:8080/user/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email.value, 
    password: password.value,
  }),
    });

    if (!response.ok) {
      const data = await response.json();
      if (data.error === 'Invalid email or password') {
        if (data.field === 'email') emailError.value = 'Email invalide';
        else if (data.field === 'password') passwordError.value = 'Mot de passe incorrect';
        return;
      }
      console.error('Erreur de connexion:', data);
      return;
    }

    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    await router.push('/dashboard');
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};

</script>
