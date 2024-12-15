<template>
    <div class="unavailability-form p-4">
      <h3 class="text-lg font-semibold mb-4">Définir une Indisponibilité</h3>
      <form @submit.prevent="submitUnavailability" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Date de début</label>
          <input 
            type="datetime-local" 
            v-model="startTime"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Date de fin</label>
          <input 
            type="datetime-local" 
            v-model="endTime"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
        </div>
  
        <div>
          <label class="block text-sm font-medium text-gray-700">Raison</label>
          <textarea 
            v-model="reason"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows="3"
            required
          ></textarea>
        </div>
  
        <button 
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
import { useStore } from 'vuex';
  
  export default {
    setup() {
      const store = useStore()
      const startTime = ref('')
      const endTime = ref('')
      const reason = ref('')
  
      const submitUnavailability = async () => {
        try {
          await store.dispatch('professors/addUnavailability', {
            startTime: startTime.value,
            endTime: endTime.value,
            reason: reason.value
          })
          
          // Réinitialiser le formulaire
          startTime.value = ''
          endTime.value = ''
          reason.value = ''
          
        } catch (error) {
          console.error('Erreur lors de l\'ajout de l\'indisponibilité:', error)
        }
      }
  
      return {
        startTime,
        endTime,
        reason,
        submitUnavailability
      }
    }
  }
  </script>