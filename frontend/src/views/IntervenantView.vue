<template>
  <div class="calendar-container">
    <!-- Formulaire de sélection de dates -->
    <div class="date-selection-form mb-4">
      <div class="form-group">
        <label for="startDate">Date de début:</label>
        <input type="date" id="startDate" v-model="formData.startDate" class="form-control" />
      </div>
      <div class="form-group">
        <label for="endDate">Date de fin:</label>
        <input type="date" id="endDate" v-model="formData.endDate" class="form-control" />
      </div>
      <button @click="addDateRange" class="btn btn-primary mt-2">Ajouter au calendrier</button>
      <button @click="getSelectedSlots" class="btn btn-primary mt-2 ml-2">Valider les disponibilités</button>
      <button
        @click="toggleAvailability"
        :class="['btn', 'mt-2', 'ml-2', isAvailable ? 'btn-success' : 'btn-danger']"
      >
        {{ isAvailable ? 'Disponible' : 'Occupé' }}
      </button>
    </div>

    <!-- Calendrier -->
    <FullCalendar ref="calendar" :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

export default {
  name: 'IntervenantView',
  components: { FullCalendar },
  data() {
    return {
      formData: {
        startDate: '',
        endDate: '',
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
          right: 'timeGridWeek,timeGridDay',
        },
        events: [], // Les événements seront ajoutés dynamiquement
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventChange: this.handleEventChange,
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
    };
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
    console.log("Réponse brute des disponibilités :", availabilities);

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
    console.log("Disponibilités chargées :", formattedAvailabilities);
  } catch (error) {
    console.error("Erreur attrapée lors de la récupération :", error);
  }
},
    async toggleAvailability() {
      this.isAvailable = !this.isAvailable
    },
    async handleDateSelect(selectInfo) {
      const title = this.isAvailable ? 'Disponible' : 'Occupé';
      const calendarApi = selectInfo.view.calendar;

      const newEvent = calendarApi.addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733',
        allDay: selectInfo.allDay,
      });

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
        console.log('Disponibilité enregistrée avec succès', data);
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
    async addDateRange() {
      if (!this.formData.startDate || !this.formData.endDate) {
        alert('Veuillez sélectionner une date de début et de fin');
        console.error('Dates manquantes :', {
          startDate: this.formData.startDate,
          endDate: this.formData.endDate,
        });
        return;
      }

      const calendarApi = this.$refs.calendar.getApi();
      const startDate = new Date(this.formData.startDate);
      startDate.setHours(8, 0, 0);

      const endDate = new Date(this.formData.endDate);
      endDate.setHours(20, 0, 0);

      const newEvent = calendarApi.addEvent({
        title: this.isAvailable ? 'Disponible' : 'Occupé',
        start: startDate,
        end: endDate,
        backgroundColor: this.isAvailable ? '#4CAF50' : '#FF5733',
      });

      const token = localStorage.getItem('token');
      if (!token) {
        alert("Utilisateur non trouvé. Veuillez vous connecter.");
        console.error('Token manquant dans le localStorage.');
        newEvent.remove();
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
            start_datetime: startDate,
            end_datetime: endDate,
            is_available: this.isAvailable,
          }),
        });

        if (!response.ok) {
          console.error('Réponse brute :', response);
          throw new Error("Erreur lors de l'enregistrement.");
        }

        const data = await response.json();
        newEvent.setProp('id', data.id);
        console.log('Disponibilité enregistrée avec succès :', data);
      } catch (error) {
        console.error('Erreur attrapée :', error);
        newEvent.remove();
        alert("Une erreur est survenue lors de l'enregistrement.");
      }

      this.formData.startDate = '';
      this.formData.endDate = '';
    },
  },
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
  background-color: #4caf50;
  color: white;
}
.btn-danger {
  background-color: #ff5733;
  color: white;
}
</style>
