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

          <!-- Filtres -->
          <div class="grid grid-cols-3 gap-4 mt-4">
            <!-- Filtre Filières -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select 
                v-model="filters.sector"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="applyFilters"
              >
                <option value="">Toutes les filières</option>
                <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                  {{ sector.name }}
                </option>
              </select>
            </div>

            <!-- Filtre Professeurs -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Professeur</label>
              <select 
                v-model="filters.professor"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="applyFilters"
              >
                <option value="">Tous les professeurs</option>
                <option v-for="professor in professors" :key="professor.id" :value="professor.id">
                  {{ professor.firstName }} {{ professor.lastName }}
                </option>
              </select>
            </div>

            <!-- Filtre Salles -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <select 
                v-model="filters.room"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                @change="applyFilters"
              >
                <option value="">Toutes les salles</option>
                <option v-for="room in rooms" :key="room.id" :value="room.id">
                  {{ room.name }}
                </option>
              </select>
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
import frLocale from '@fullcalendar/core/locales/fr';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import FullCalendar from '@fullcalendar/vue3';
import Sidebar from '../components/common/Sidebar.vue';

export default {
  name: 'Planning',
  components: {
    Sidebar,
    FullCalendar,
  },
  data() {
    return {
      filters: {
        sector: '',
        professor: '',
        class: '',
        room: ''
      },
      sectors: [],
      professors: [],
      classes: [],
      rooms: [],
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
          right: 'timeGridDay,timeGridWeek'
        },
        eventClick: this.handleEventClick,
        select: this.handleDateSelect,
        eventChange: this.handleEventChange,
        events: [],
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false,
        },
        eventContent: (info) => {
          return {
            html: `
              <div>
                <strong>${info.event.title}</strong>
                <br>
                ${info.timeText}
              </div>
            `,
          };
        },
      },
    };
  },
  async mounted() {
    await this.fetchRooms();
    await this.fetchProfessors();
    await this.fetchSectors();
  },
  methods: {
    async fetchRooms() {
      try {
        const response = await fetch('http://localhost:8080/room');
        if (!response.ok) throw new Error('Erreur lors de la récupération des salles');

        const rooms = await response.json();
        this.rooms = rooms; 
      } catch (error) {
        console.error('Erreur lors de la récupération des salles:', error);
      }
    },
    async fetchProfessors() {
      try {
        const response = await fetch('http://localhost:8080/user/professor');
        if (!response.ok) throw new Error('Erreur lors de la récupération des professeurs');

        const professors = await response.json();
        this.professors = professors;
      } catch (error) {
        console.error('Erreur lors de la récupération des professeurs:', error);
      }
    },
    async fetchSectors() {
      try {
        const response = await fetch('http://localhost:8080/sector');
        if (!response.ok) throw new Error('Erreur lors de la récupération des sectors');

        const sectors = await response.json();
        this.sectors = sectors;
      } catch (error) {
        console.error('Erreur lors de la récupération des sectors:', error);
      }
    },
    handleDateSelect(selectInfo) {
      const title = 'Disponible';
      const calendarApi = selectInfo.view.calendar;
      calendarApi.addEvent({
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        textColor: '#ffffff',
      });
    },

    handleEventClick(clickInfo) {
      if (confirm('Supprimer cet événement ?')) {
        clickInfo.event.remove();
      }
    },

    handleEventChange(changeInfo) {
      // Mettre à jour les données du calendrier en fonction des modifications
      console.log("Événement modifié:", changeInfo.event);
    },

    async applyFilters() {
      const token = localStorage.getItem('token');
      try {
        let url = 'http://localhost:8080/availabilities/filter?';
        if (this.filters.sector) url += `sector=${this.filters.sector}&`;
        if (this.filters.professor) url += `professor=${this.filters.professor}&`;
        if (this.filters.class) url += `class=${this.filters.class}&`;
        if (this.filters.room) url += `room=${this.filters.room}&`;

        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erreur lors de la filtration');

        const filteredEvents = await response.json();
        const calendarApi = this.$refs.calendar.getApi();
        calendarApi.removeAllEvents();

        filteredEvents.forEach(event => {
          calendarApi.addEvent({
            id: event.id,
            title: event.is_available ? 'Disponible' : 'Occupé',
            start: event.start_datetime,
            end: event.end_datetime,
            backgroundColor: event.is_available ? '#4CAF50' : '#FF5733',
          });
        });
      } catch (error) {
        console.error('Erreur lors de l\'application des filtres:', error);
      }
    }
  }
};
</script>