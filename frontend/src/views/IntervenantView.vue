<template>
    <div class="calendar-container">
      <!-- Formulaire de sélection de dates -->
      <div class="date-selection-form mb-4">
        <div class="form-group">
          <label for="startDate">Date de début:</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="formData.startDate"
            class="form-control"
          >
        </div>
        <div class="form-group">
          <label for="endDate">Date de fin:</label>
          <input 
            type="date" 
            id="endDate" 
            v-model="formData.endDate"
            class="form-control"
          >
        </div>
        <button 
          @click="addDateRange" 
          class="btn btn-primary mt-2"
        >
          Ajouter au calendrier
        </button>
        <!-- Nouveau bouton pour valider les disponibilités -->
        <button 
          @click="getSelectedSlots" 
          class="btn btn-primary mt-2 ml-2"
        >
          Valider les disponibilités
        </button>
        <button 
          @click="toggleAvailability" 
          :class="['btn', 'mt-2', 'ml-2', isAvailable ? 'btn-success' : 'btn-danger']"
        >
          {{ isAvailable ? 'Disponible' : 'Occupé' }}
        </button>
      </div>
   
      <!-- Calendrier -->
      <FullCalendar
        ref="calendar"
        :options="calendarOptions"
      />
    </div>
   </template>
   
   <script>
   import FullCalendar from '@fullcalendar/vue3'
   import timeGridPlugin from '@fullcalendar/timegrid'
   import interactionPlugin from '@fullcalendar/interaction'
   import frLocale from '@fullcalendar/core/locales/fr'
   
   export default {
    name: 'IntervenantView',
    components: {
      FullCalendar
    },
    data() {
      return {
        formData: {
          startDate: '',
          endDate: ''
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
            right: 'timeGridWeek,timeGridDay'
          },
          eventClick: this.handleEventClick,
          select: this.handleDateSelect,
          eventChange: this.handleEventChange,
          events: [],
          eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: false
          },
          eventContent: (info) => {
            return {
              html: `
                <div>
                  <strong>${info.event.title}</strong>
                  <br>
                  ${info.timeText}
                </div>
              `
            }
          }
        }
      }
    },
    methods: {
      toggleAvailability() {
        this.isAvailable = !this.isAvailable;
      },
      handleDateSelect(selectInfo) {
        const title = this.isAvailable ? 'Disponible' : 'Occupé';
        const calendarApi = selectInfo.view.calendar
        calendarApi.addEvent({
          title,
          start: selectInfo.start,
          end: selectInfo.end,
          backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733'
        })

        const events = calendarApi.getEvents();
        const eventData = events.map(event => ({
          title: event.title,
          start: event.start,
          end: event.end,
        }));
        console.log('Données actuelles du calendrier :', JSON.stringify(eventData));
      },
      handleEventClick(clickInfo) {
        if (confirm('Supprimer cet événement ?')) {
          clickInfo.event.remove()
        }
      },
      handleEventChange(changeInfo) {
        console.log('Événement modifié:', changeInfo.event.toPlainObject())
      },
      addDateRange() {
        if (!this.formData.startDate || !this.formData.endDate) {
          alert('Veuillez sélectionner une date de début et de fin')
          return
        }
   
        const calendarApi = this.$refs.calendar.getApi()
        
        const startDate = new Date(this.formData.startDate)
        startDate.setHours(8, 0, 0) // Début à 8h
        
        const endDate = new Date(this.formData.endDate)
        endDate.setHours(20, 0, 0) // Fin à 20h
   
        calendarApi.addEvent({
          title: this.isAvailable ? 'Disponible' : 'Occupé',
          start: startDate,
          end: endDate,
          backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733'
        })
   
        this.formData.startDate = ''
        this.formData.endDate = ''
      },
      getSelectedSlots() {
        const calendar = this.$refs.calendar.getApi()
        const events = calendar.getEvents()
        
        const availableSlots = events.map(event => ({
          debut: event.start,
          fin: event.end,
          title: event.title
        }))
   
        console.log('Créneaux de disponibilité:', availableSlots)
        return availableSlots
      }
    }
   }
   </script>
   
   <style scoped>
   .calendar-container {
    width: 100%;
    max-width: 1200px;
   }
   
   .date-selection-form {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
   }
   
   .form-group {
    margin-bottom: 1rem;
   }
   
   .form-group label {
    display: block;
    margin-bottom: 0.5rem;
   }
   
   .form-control {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
   }
   
   .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
   }
   
   .btn-primary {
    background-color: #007bff;
    color: white;
   }
   
   .mt-2 {
    margin-top: 0.5rem;
   }
   
   .mb-4 {
    margin-bottom: 1rem;
   }
   
   .ml-2 {
    margin-left: 0.5rem;
   }

   .btn-success {
      background-color: #4CAF50;
      color: white;
    }
    .btn-danger {
      background-color: #FF5733;
      color: white;
    }
   </style>