<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 ml-64">
      <!-- Header avec les contrôles -->
      <div class="bg-white shadow-sm p-6">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-gray-800">Planning</h1>
            <div class="flex space-x-4"></div>
          </div>
 
          <!-- Inputs pour les dates et heures -->
          <div class="flex items-center gap-4">
            <!-- Première ligne avec dates et heures -->
            <div class="flex gap-4 flex-1">
              <input 
                type="date" 
                v-model="formData.startDate" 
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              />
              <input 
                type="date" 
                v-model="formData.endDate"
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              />
              <input 
                type="time" 
                v-model="formData.startTime" 
                min="08:00"
                max="20:00"
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              />
              <span class="self-center text-gray-500">à</span>
              <input 
                type="time" 
                v-model="formData.endTime" 
                min="08:00"
                max="20:00"
                class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              />
            </div>
 
            <!-- Boutons d'action -->
            <div class="flex items-center gap-2">
              <button 
                @click="addDateRange" 
                class="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Ajouter période
              </button>
              <button 
                @click="getSelectedSlots" 
                class="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition duration-200"
              >
                Valider disponibilités
              </button>
              <button
                @click="toggleAvailability"
                :class="[
                  'px-4 py-2 font-medium rounded-lg transition duration-200 min-w-[120px]',
                  isAvailable ? 
                    'bg-green-500 text-white hover:bg-green-600' : 
                    'bg-red-500 text-white hover:bg-red-600'
                ]"
              >
                {{ isAvailable ? 'Disponible' : 'Occupé' }}
              </button>
            </div>
          </div>
        </div>
      </div>
 
      <!-- Calendrier -->
      <div class="p-6">
        <div class="bg-white rounded-xl shadow-sm">
          <FullCalendar ref="calendar" :options="calendarOptions" />
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script>
 import FullCalendar from '@fullcalendar/vue3'
 import timeGridPlugin from '@fullcalendar/timegrid'
 import interactionPlugin from '@fullcalendar/interaction'
 import frLocale from '@fullcalendar/core/locales/fr'
 import Sidebar from '../components/common/Sidebar.vue'
 
 export default {
  name: 'IntervenantView',
  components: {
    FullCalendar,
    Sidebar
  },
  data() {
    return {
      formData: {
        startDate: '',
        endDate: '',
        startTime: '08:00',
        endTime: '20:00',
      },
      isAvailable: true,
      calendarOptions: {
        plugins: [timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        locale: frLocale,
        selectable: true,
        editable: true,
        selectMirror: true,
        weekends: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        events: [],
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventChange: this.handleEventChange,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        },
        eventContent: (info) => ({
          html: `
            <div>
              <strong>${info.event.title}</strong>
              <br>
              ${info.timeText}
            </div>
          `,
        }),
      },
    }
  },
  async mounted() {
    await this.fetchAvailabilities();
  },
  methods: {
    async fetchAvailabilities() {
      const professorId = 4; // À remplacer par une logique dynamique si besoin
      const token = localStorage.getItem('token');
 
      if (!token) {
        alert("Utilisateur non trouvé. Veuillez vous connecter.");
        return;
      }
 
      try {
        const response = await fetch(`http://localhost:8080/availabilities/${professorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
 
        if (!response.ok) throw new Error("Erreur lors de la récupération des disponibilités.");
 
        const availabilities = await response.json();
        const formattedAvailabilities = availabilities
          .filter((availability) => availability)
          .map((availability) => ({
            id: availability.id,
            title: 'Disponible',
            start: availability.start_datetime,
            end: availability.end_datetime,
            backgroundColor: availability.is_available ? '#4CAF50' : '#FF5733',
          }));
 
        this.calendarOptions.events = formattedAvailabilities;
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      }
    },
 
    async toggleAvailability() {
      this.isAvailable = !this.isAvailable
    },
 
    async addDateRange() {
  if (!this.formData.startDate || !this.formData.endDate || !this.formData.startTime || !this.formData.endTime) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  const calendarApi = this.$refs.calendar.getApi();
  
  // Conversion des heures et minutes
  const [startHours, startMinutes] = this.formData.startTime.split(':');
  const [endHours, endMinutes] = this.formData.endTime.split(':');

  // Création des dates de début et de fin
  let currentDate = new Date(this.formData.startDate);
  const endDate = new Date(this.formData.endDate);

  // Vérification de la période
  if (endDate < currentDate) {
    alert("La date de fin doit être après la date de début");
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    alert("Utilisateur non trouvé. Veuillez vous connecter.");
    return;
  }

  // Boucle pour créer un événement pour chaque jour
  while (currentDate <= endDate) {
    // Création des dates avec les heures pour le jour courant
    const startDateTime = new Date(currentDate);
    startDateTime.setHours(parseInt(startHours), parseInt(startMinutes), 0);

    const endDateTime = new Date(currentDate);
    endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0);

    // Création de l'événement dans le calendrier
    const newEvent = calendarApi.addEvent({
      title: this.isAvailable ? 'Disponible' : 'Occupé',
      start: startDateTime,
      end: endDateTime,
      backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733',
    });

    try {
      const response = await fetch('http://localhost:8080/availabilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          is_available: this.isAvailable,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement.");
      }

      const data = await response.json();
      newEvent.setProp('id', data.id);

    } catch (error) {
      console.error(error);
      newEvent.remove();
      alert("Une erreur est survenue lors de l'enregistrement.");
    }

    // Passage au jour suivant
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Reset form après création de tous les événements
  this.formData.startDate = '';
  this.formData.endDate = '';
  this.formData.startTime = '08:00';
  this.formData.endTime = '20:00';
},
 
    async handleDateSelect(selectInfo) {
      const title = this.isAvailable ? 'Disponible' : 'Occupé'
      const calendarApi = selectInfo.view.calendar
 
      const newEvent = calendarApi.addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733',
        allDay: selectInfo.allDay,
      })
 
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Utilisateur non trouvé. Veuillez vous connecter.");
        return;
      }
 
      try {
        const response = await fetch('http://localhost:8080/availabilities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_datetime: selectInfo.start,
            end_datetime: selectInfo.end,
            is_available: this.isAvailable,
          }),
        });
 
        if (!response.ok) throw new Error("Erreur lors de l'enregistrement.");
 
        const data = await response.json();
        newEvent.setProp('id', data.id);
      } catch (error) {
        console.error(error);
        newEvent.remove();
      }
    },
 
    async handleEventClick(clickInfo) {
      if (confirm('Supprimer cet événement ?')) {
        try {
          if (!clickInfo.event.id) {
            alert("Impossible de supprimer cet événement, l'ID est manquant.")
            return
          }
 
          const token = localStorage.getItem('token');
          const response = await fetch(
            `http://localhost:8080/availabilities/${clickInfo.event.id}`,
            {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          )
 
          if (!response.ok) {
            alert('Une erreur est survenue lors de la suppression.')
            return
          }
 
          clickInfo.event.remove()
        } catch (error) {
          console.error(error)
          alert('Une erreur interne est survenue.')
        }
      }
    },
 
    async handleEventChange(changeInfo) {
      try {
        const event = changeInfo.event
        if (!event.id) return
 
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/availabilities/${event.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            start_datetime: event.start,
            end_datetime: event.end,
            is_available: event.title === 'Disponible',
          }),
        })
 
        if (!response.ok) throw new Error('Erreur lors de la mise à jour.')
      } catch (error) {
        console.error(error)
      }
    },
 
    async getSelectedSlots() {
      console.log("Validation des disponibilités")
    }
  }
 }
 </script>
 
 <style>
 :deep(.fc) {
  @apply font-sans;
 }
 
 :deep(.fc-toolbar-title) {
  @apply text-xl font-semibold text-gray-800;
 }
 
 :deep(.fc-button) {
  @apply px-4 py-2 text-sm font-medium;
 }
 
 :deep(.fc-event) {
  @apply rounded-lg border-none;
 }
 
 :deep(.fc-timegrid-event) {
  @apply p-2;
 }
 
 :deep(.fc-timegrid-slot) {
  @apply h-8;
 }
 
 :deep(.fc-button-primary) {
  @apply bg-indigo-600 border-0 hover:bg-indigo-700 text-white !important;
 }
 </style>