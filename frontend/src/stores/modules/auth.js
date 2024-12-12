const state = {
  user: JSON.parse(localStorage.getItem('user')) || null, // Récupérer l'utilisateur depuis le stockage local si disponible
  token: localStorage.getItem('token') || null, // Récupérer le token depuis le stockage local
};

const mutations = {
  setUser(state, user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user)); // Sauvegarder l'utilisateur dans le stockage local
  },
  setToken(state, token) {
    state.token = token;
    localStorage.setItem('token', token); // Sauvegarder le token dans le stockage local
  },
  clearAuth(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },
};

const actions = {
  async login({ commit }, { email, password }) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Échec de la connexion');
      }

      const data = await response.json();
      commit('setUser', data.user);
      commit('setToken', data.token);

      // Rediriger l'utilisateur après la connexion
      this.$router.push('/');
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      // Vous pouvez ici afficher un message d'erreur à l'utilisateur
    }
  },

  logout({ commit }) {
    commit('clearAuth');
    this.$router.push('/login'); // Rediriger vers la page de connexion après la déconnexion
  },
};

const getters = {
  isAuthenticated: (state) => !!state.token, // L'utilisateur est authentifié si un token est présent
  user: (state) => state.user,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
