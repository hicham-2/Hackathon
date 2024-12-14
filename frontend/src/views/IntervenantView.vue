<template>
  <div class="flex min-h-screen bg-[#B0E1EA]">
    <Sidebar />
    <div class="flex-1 ml-64">
      <!-- Header avec les contrôles -->
      <div class="bg-white shadow-sm p-6">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-semibold text-gray-800">Planning</h1>
            <div class="flex space-x-4">
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Aujourd'hui
              </button>
            </div>
          </div>

          <!-- Inputs pour les dates et heures -->
          <div class="flex items-center gap-4">
            <!-- Première ligne avec dates et heures -->
            <div class="flex gap-4 flex-1">
              <input 
                type="date" 
                v-model="formData.startDate" 
                class="date-input"
              />
              <input 
                type="date" 
                v-model="formData.Date" 
                class="date-input"
              />
              <input 
                type="time" 
                v-model="formData.startTime" 
                class="date-input"
                min="08:00"
                max="20:00"
              />
              <span class="self-center text-gray-500">à</span>
              <input 
                type="time" 
                v-model="formData.endTime" 
                class="date-input"
                min="08:00"
                max="20:00"
              />
            </div>

            <!-- Boutons d'action -->
            <div class="flex gap-2">
              <button @click="addDateRange" class="btn bg-indigo-600 text-white hover:bg-indigo-700">
                Ajouter période
              </button>
              <button @click="getSelectedSlots" class="btn bg-gray-600 text-white hover:bg-gray-700">
                Valider disponibilités
              </button>
              <button
                @click="toggleAvailability"
                :class="['btn', isAvailable ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600', 'text-white']"
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
import dayGridPlugin from '@fullcalendar/daygrid'
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
       endDate: '', // Ajout de la date de fin
       startTime: '08:00',
       endTime: '20:00',
     },
     isAvailable: true,
     calendarOptions: {
       plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
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
 methods: {
   async toggleAvailability() {
     this.isAvailable = !this.isAvailable
   },

   async addDateRange() {
     if (!this.formData.startDate || !this.formData.endDate || !this.formData.startTime || !this.formData.endTime) {
       alert('Veuillez remplir tous les champs');
       return;
     }

     const calendarApi = this.$refs.calendar.getApi();
     const startDateTime = new Date(`${this.formData.startDate}T${this.formData.startTime}`);
     const endDateTime = new Date(`${this.formData.endDate}T${this.formData.endTime}`);

     // Vérifier que la date de fin n'est pas avant la date de début
     if (endDateTime <= startDateTime) {
       alert("La date/heure de fin doit être après la date/heure de début");
       return;
     }

     const newEvent = calendarApi.addEvent({
       title: this.isAvailable ? 'Disponible' : 'Occupé',
       start: startDateTime,
       end: endDateTime,
       backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733',
     });

     try {
       const response = await fetch('http://localhost:8080/availabilities', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           user_id: 1, // A remplacer par l'id du user connecté
           start_datetime: startDateTime,
           end_datetime: endDateTime,
           is_available: this.isAvailable,
         }),
       });

       if (!response.ok) throw new Error("Erreur lors de l'enregistrement.");

       const data = await response.json();
       newEvent.setProp('id', data.id);
       console.log('Disponibilité enregistrée avec succès', data);
       
       // Reset form
       this.formData.startDate = '';
       this.formData.endDate = '';
       this.formData.startTime = '08:00';
       this.formData.endTime = '20:00';
     } catch (error) {
       console.error(error);
       newEvent.remove();
       alert("Une erreur est survenue lors de l'enregistrement.");
     }
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

     try {
       const response = await fetch('http://localhost:8080/availabilities', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           user_id: 1, // A remplacer par l'id du user co
           start_datetime: selectInfo.start,
           end_datetime: selectInfo.end,
           is_available: this.isAvailable,
         }),
       })

       if (!response.ok) throw new Error("Erreur lors de l'enregistrement.")

       const data = await response.json()
       newEvent.setProp('id', data.id)
       console.log('Disponibilité enregistrée avec succès', data)
     } catch (error) {
       console.error(error)
       newEvent.remove()
     }
   },

   async handleEventClick(clickInfo) {
     if (confirm('Supprimer cet événement ?')) {
       try {
         if (!clickInfo.event.id) {
           alert("Impossible de supprimer cet événement, l'ID est manquant.")
           return
         }

         const response = await fetch(
           `http://localhost:8080/availabilities/${clickInfo.event.id}`,
           {
             method: 'DELETE',
           }
         )

         if (!response.ok) {
           alert('Une erreur est survenue lors de la suppression.')
           return
         }

         clickInfo.event.remove()
         console.log('Disponibilité supprimée avec succès')
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

       const response = await fetch(`http://localhost:8080/availabilities/${event.id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           start_datetime: event.start,
           end_datetime: event.end,
           is_available: event.title === 'Disponible',
         }),
       })

       if (!response.ok) throw new Error('Erreur lors de la mise à jour.')
       console.log('Disponibilité mise à jour avec succès')
     } catch (error) {
       console.error(error)
     }
   },

   async getSelectedSlots() {
     // Implémentez ici la logique pour valider les disponibilités
     console.log("Validation des disponibilités")
   }
 }
}
</script>

<style scoped>
.input-group {
  display: flex;
  gap: 1rem;
}

.date-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  background: #f8f9fa;
}

.date-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.mt-2 {
  margin-top: 0.5rem;
}

.calendar-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.control-panel {
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}


.date-inputs {
  flex: 1;
  min-width: 300px;
}

.input-group {
  display: flex;
  gap: 1rem;
}

.date-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
  background: #f8f9fa;
}

.date-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-primary {
  background: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background: #357abd;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.status-btn {
  min-width: 120px;
}

.status-available {
  background: #34c759;
  color: white;
}

.status-available:hover {
  background: #2db14f;
}

.status-busy {
  background: #ff3b30;
  color: white;
}

.status-busy:hover {
  background: #e6352b;
}

.calendar-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

/* Personnalisation du calendrier FullCalendar */
:deep(.fc) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem !important;
  font-weight: 600;
}

:deep(.fc-button) {
  text-transform: capitalize !important;
  padding: 0.5rem 1rem !important;
}

:deep(.fc-event) {
  border-radius: 4px;
  border: none;
}

:deep(.fc-timegrid-event) {
  padding: 4px;
}

:deep(.fc-timegrid-slot) {
  height: 2rem !important;
}
.calendar-container {
  width: 100%;
  overflow: hidden;
}
.date-input {
  @apply border-gray-200;
}

.btn-primary {
  @apply bg-indigo-600 hover:bg-indigo-700;
}

.btn-secondary {
  @apply bg-gray-600 hover:bg-gray-700;
}

:deep(.fc-toolbar-title) {
  @apply text-gray-800;
}

:deep(.fc-button-primary) {
  @apply bg-indigo-600 border-0 hover:bg-indigo-700 !important;
}
.dashboard-container {
  background-color: #B0E1EA !important;
}
</style>